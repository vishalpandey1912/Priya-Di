import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
    supabaseFixourneet,
    FIXOURNEET_SUPABASE_ANON_KEY,
    FIXOURNEET_EDGE_SEND_EMAIL
} from '@/lib/supabase-fixourneet';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/fixourneet/sign
 * Inserts a signature into Santosh's Supabase (pedagogy-audit project) and
 * invokes the Edge Function send-petition-verify to deliver the OTP email.
 */

const ALLOWED_STATES = new Set([
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
    'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
    'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
]);

function hashIp(ip: string): string {
    const salt = process.env.IP_SALT || 'fixourneet-default-salt-2026';
    return crypto.createHash('sha256').update(ip + salt).digest('hex').slice(0, 32);
}

function generateToken(): string {
    return crypto.randomBytes(24).toString('base64url');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ── Validation ────────────────────────────────────────────────
        const fullName = (body.full_name || '').trim();
        const email = (body.email || '').trim().toLowerCase();
        const city = (body.city || '').trim();
        const state = (body.state || '').trim();
        const role = body.role as string;

        if (!fullName || fullName.length < 2) {
            return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
        }
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
        }
        if (!city) {
            return NextResponse.json({ error: 'Please enter your city.' }, { status: 400 });
        }
        if (!ALLOWED_STATES.has(state)) {
            return NextResponse.json({ error: 'Please select your state.' }, { status: 400 });
        }
        if (!['candidate','parent','educator','supporter'].includes(role)) {
            return NextResponse.json({ error: 'Please select your role.' }, { status: 400 });
        }
        if (!body.privacy_consent) {
            return NextResponse.json({ error: 'Privacy consent is required.' }, { status: 400 });
        }

        // Candidate-only fields
        let candidateFields: Record<string, any> = {};
        if (role === 'candidate') {
            const att = body.neet_attempt;
            if (!['first','dropper_1','dropper_2plus','repeater'].includes(att)) {
                return NextResponse.json({ error: 'Please select your NEET attempt status.' }, { status: 400 });
            }
            const passingYear = parseInt(body.class_12_passing_year);
            if (!passingYear || passingYear < 2020 || passingYear > 2027) {
                return NextResponse.json({ error: 'Please select your Class 12 passing year.' }, { status: 400 });
            }
            const targetYear = parseInt(body.target_year);
            if (![2026, 2027].includes(targetYear)) {
                return NextResponse.json({ error: 'Please select your target year.' }, { status: 400 });
            }
            candidateFields = {
                neet_attempt: att,
                class_12_passing_year: passingYear,
                target_year: targetYear,
                preferred_medium: ['english','hindi','other'].includes(body.preferred_medium) ? body.preferred_medium : null,
                state_board: (body.state_board || '').trim() || null,
                neet_app_number_last4: typeof body.neet_app_number_last4 === 'string' && /^\d{4}$/.test(body.neet_app_number_last4)
                    ? body.neet_app_number_last4 : null
            };
        }

        // Minor
        const isMinor = !!body.is_minor;
        if (isMinor && (!body.parent_name || !body.parent_consent)) {
            return NextResponse.json({ error: 'Parent name and consent are required for signatories under 18.' }, { status: 400 });
        }

        // WhatsApp
        const whatsappNumber = (body.whatsapp_number || '').trim() || null;
        if (whatsappNumber && !body.whatsapp_consent) {
            return NextResponse.json({ error: 'Please confirm WhatsApp consent, or leave the number blank.' }, { status: 400 });
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || req.headers.get('x-real-ip') || '0.0.0.0';
        const userAgent = req.headers.get('user-agent') || null;
        const token = generateToken();
        const now = new Date().toISOString();

        // ── Insert OR update existing unverified signature ─────────────
        // We have a unique index on lower(email). On conflict, we update.
        // Anon role can INSERT (per RLS policy). For UPDATE on conflict we use the
        // upsert pattern but anon doesn't have UPDATE access. So instead:
        //   Try insert. If unique-violation, query existing row, check status, regenerate.

        const insertPayload = {
            full_name: fullName,
            email,
            city,
            state,
            role,
            ...candidateFields,
            is_minor: isMinor,
            parent_name: isMinor ? (body.parent_name || '').trim() : null,
            parent_consent: isMinor ? !!body.parent_consent : false,
            desi_educators_optin: !!body.desi_educators_optin,
            whatsapp_number: whatsappNumber,
            whatsapp_consent: !!body.whatsapp_consent,
            privacy_consent: true,
            otp_token: token,
            otp_sent_at: now,
            ip_hash: hashIp(ip),
            user_agent: userAgent,
            utm_source: body.utm_source || null,
            utm_medium: body.utm_medium || null,
            utm_campaign: body.utm_campaign || null
        };

        const { error: insertErr } = await supabaseFixourneet
            .from('signatures')
            .insert(insertPayload);

        if (insertErr) {
            // Unique-violation on email → existing signature. We can't UPDATE as anon.
            // Treat as "user already submitted; ask them to check email or wait if they
            // genuinely need to resend, we accept the deduplication and tell them so".
            if (insertErr.code === '23505' || /duplicate/i.test(insertErr.message)) {
                return NextResponse.json({
                    ok: true,
                    duplicateEmail: true,
                    message: "This email is already on the petition. Check your inbox for the verification link (also check spam). If you can't find it, wait a few minutes and try again from a different email."
                });
            }
            console.error('[fixourneet/sign] insert error:', insertErr);
            return NextResponse.json({ error: insertErr.message }, { status: 500 });
        }

        // ── Invoke edge function to send verification email ───────────
        try {
            const edgeResp = await fetch(FIXOURNEET_EDGE_SEND_EMAIL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${FIXOURNEET_SUPABASE_ANON_KEY}`,
                    'apikey': FIXOURNEET_SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            const edgeJson = await edgeResp.json().catch(() => ({}));
            if (!edgeResp.ok || !edgeJson.ok) {
                console.warn('[fixourneet/sign] edge function returned non-ok:', edgeResp.status, edgeJson);
            }
        } catch (e) {
            console.error('[fixourneet/sign] edge function exception:', e);
        }

        return NextResponse.json({
            ok: true,
            message: 'Check your inbox to verify your signature. The email may take up to 60 seconds. Also check your spam folder.'
        });

    } catch (err: any) {
        console.error('[fixourneet/sign] error:', err);
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
