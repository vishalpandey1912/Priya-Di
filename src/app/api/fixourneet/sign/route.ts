import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/fixourneet/sign
 *
 * WORKAROUND: Uses the existing `leads` table (anon insert RLS already in place)
 * with petition data encoded as JSON in `user_agent` column and tagged via
 * source_path = '/fixourneet'.
 *
 * Later, when the proper `signatures` table is created, run the migration script
 * in scripts/migrate-leads-to-signatures.ts to move rows.
 */

const ALLOWED_STATES = new Set([
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
    'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
    'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
]);

const SOURCE_TAG = '/fixourneet';

interface PetitionData {
    schema: 'fixourneet_v1';
    role: 'candidate' | 'parent' | 'educator' | 'supporter';
    city: string;
    state: string;
    full_name: string;
    neet_attempt?: string | null;
    class_12_passing_year?: number | null;
    target_year?: number | null;
    preferred_medium?: string | null;
    state_board?: string | null;
    neet_app_number_last4?: string | null;
    is_minor: boolean;
    parent_name?: string | null;
    parent_consent: boolean;
    desi_educators_optin: boolean;
    whatsapp_consent: boolean;
    privacy_consent: boolean;
    real_user_agent: string | null;
    ip_hash: string;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    otp_token: string;
    otp_sent_at: string;
    otp_verified: boolean;
    otp_verified_at: string | null;
}

function hashIp(ip: string): string {
    const salt = process.env.IP_SALT || 'fixourneet-default-salt-2026';
    return crypto.createHash('sha256').update(ip + salt).digest('hex').slice(0, 32);
}

function generateToken(): string {
    return crypto.randomBytes(24).toString('base64url');
}

async function sendVerificationEmail(opts: {
    to: string;
    name: string;
    token: string;
    origin: string;
}): Promise<{ sent: boolean; provider: string }> {
    const verifyUrl = `${opts.origin}/api/fixourneet/verify?token=${opts.token}`;
    const subject = 'Verify your signature on Fix Our NEET';
    const text = `Hi ${opts.name},

You're one click away from adding your name to Fix Our NEET.

Click here to verify your signature:
${verifyUrl}

This link expires in 48 hours.

If you did not sign the petition, ignore this email; nothing will be added.

Desi Educators
fixourneet@desieducators.com`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
        try {
            const resp = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM || 'Fix Our NEET <onboarding@resend.dev>',
                    to: [opts.to],
                    subject,
                    text
                })
            });
            if (resp.ok) return { sent: true, provider: 'resend' };
            const errBody = await resp.text();
            console.error('[fixourneet] Resend failed:', resp.status, errBody);
        } catch (e) {
            console.error('[fixourneet] Resend error:', e);
        }
    }

    console.warn(`[fixourneet] EMAIL FALLBACK — verify URL for ${opts.to}:`);
    console.warn(`  ${verifyUrl}`);
    return { sent: false, provider: 'console' };
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
        if (!city) return NextResponse.json({ error: 'Please enter your city.' }, { status: 400 });
        if (!ALLOWED_STATES.has(state)) return NextResponse.json({ error: 'Please select your state.' }, { status: 400 });
        if (!['candidate','parent','educator','supporter'].includes(role)) {
            return NextResponse.json({ error: 'Please select your role.' }, { status: 400 });
        }
        if (!body.privacy_consent) {
            return NextResponse.json({ error: 'Privacy consent is required.' }, { status: 400 });
        }

        // Candidate fields
        let neetAttempt: string | null = null;
        let class12Year: number | null = null;
        let targetYear: number | null = null;
        let preferredMedium: string | null = null;
        let stateBoard: string | null = null;
        let appNoLast4: string | null = null;
        if (role === 'candidate') {
            neetAttempt = body.neet_attempt;
            if (!['first','dropper_1','dropper_2plus','repeater'].includes(neetAttempt!)) {
                return NextResponse.json({ error: 'Please select your NEET attempt status.' }, { status: 400 });
            }
            class12Year = parseInt(body.class_12_passing_year);
            if (!class12Year || class12Year < 2020 || class12Year > 2027) {
                return NextResponse.json({ error: 'Please select your Class 12 passing year.' }, { status: 400 });
            }
            targetYear = parseInt(body.target_year);
            if (![2026, 2027].includes(targetYear)) {
                return NextResponse.json({ error: 'Please select your target year.' }, { status: 400 });
            }
            preferredMedium = ['english','hindi','other'].includes(body.preferred_medium) ? body.preferred_medium : null;
            stateBoard = (body.state_board || '').trim() || null;
            appNoLast4 = typeof body.neet_app_number_last4 === 'string' && /^\d{4}$/.test(body.neet_app_number_last4)
                ? body.neet_app_number_last4 : null;
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

        // Metadata
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || req.headers.get('x-real-ip') || '0.0.0.0';
        const realUa = req.headers.get('user-agent') || null;

        // ── Check existing fixourneet row by email ────────────────────
        const { data: existing } = await supabaseAdmin
            .from('leads')
            .select('id, user_agent, captured_at')
            .ilike('email', email)
            .eq('source_path', SOURCE_TAG)
            .maybeSingle();

        const token = generateToken();
        const now = new Date().toISOString();

        if (existing) {
            // Parse existing petition data
            let petitionData: PetitionData | null = null;
            try {
                const ua = existing.user_agent || '';
                const idx = ua.indexOf('{"schema":"fixourneet_v1"');
                if (idx >= 0) petitionData = JSON.parse(ua.slice(idx));
            } catch {}

            if (petitionData?.otp_verified) {
                return NextResponse.json({
                    ok: true,
                    alreadyVerified: true,
                    message: 'This email has already verified a signature. Thank you!'
                });
            }
            // Rate limit re-sends
            if (petitionData?.otp_sent_at) {
                const lastSent = new Date(petitionData.otp_sent_at).getTime();
                if (Date.now() - lastSent < 10 * 60 * 1000) {
                    return NextResponse.json({
                        ok: true,
                        message: 'A verification email was just sent. Please check your inbox (including spam).'
                    });
                }
            }
            // Update with new token
            const newData: PetitionData = {
                ...(petitionData || {} as any),
                schema: 'fixourneet_v1',
                role: role as any,
                city, state, full_name: fullName,
                neet_attempt: neetAttempt, class_12_passing_year: class12Year,
                target_year: targetYear, preferred_medium: preferredMedium,
                state_board: stateBoard, neet_app_number_last4: appNoLast4,
                is_minor: isMinor,
                parent_name: isMinor ? (body.parent_name || '').trim() : null,
                parent_consent: isMinor ? !!body.parent_consent : false,
                desi_educators_optin: !!body.desi_educators_optin,
                whatsapp_consent: !!body.whatsapp_consent,
                privacy_consent: true,
                real_user_agent: realUa,
                ip_hash: hashIp(ip),
                utm_source: body.utm_source || null,
                utm_medium: body.utm_medium || null,
                utm_campaign: body.utm_campaign || null,
                otp_token: token,
                otp_sent_at: now,
                otp_verified: false,
                otp_verified_at: null
            };
            const encodedUa = `${realUa || ''} | PETITION=${JSON.stringify(newData)}`;
            await supabaseAdmin.from('leads').update({
                name: fullName,
                phone: whatsappNumber || '0000000000',
                user_agent: encodedUa
            }).eq('id', existing.id);

            const origin = req.headers.get('origin') || `https://${req.headers.get('host')}`;
            await sendVerificationEmail({ to: email, name: fullName, token, origin });
            return NextResponse.json({ ok: true, message: 'Check your inbox to verify your signature.' });
        }

        // ── Insert new row ────────────────────────────────────────────
        const petitionData: PetitionData = {
            schema: 'fixourneet_v1',
            role: role as any,
            city, state, full_name: fullName,
            neet_attempt: neetAttempt, class_12_passing_year: class12Year,
            target_year: targetYear, preferred_medium: preferredMedium,
            state_board: stateBoard, neet_app_number_last4: appNoLast4,
            is_minor: isMinor,
            parent_name: isMinor ? (body.parent_name || '').trim() : null,
            parent_consent: isMinor ? !!body.parent_consent : false,
            desi_educators_optin: !!body.desi_educators_optin,
            whatsapp_consent: !!body.whatsapp_consent,
            privacy_consent: true,
            real_user_agent: realUa,
            ip_hash: hashIp(ip),
            utm_source: body.utm_source || null,
            utm_medium: body.utm_medium || null,
            utm_campaign: body.utm_campaign || null,
            otp_token: token,
            otp_sent_at: now,
            otp_verified: false,
            otp_verified_at: null
        };

        const encodedUa = `${realUa || ''} | PETITION=${JSON.stringify(petitionData)}`;

        const { data, error } = await supabaseAdmin
            .from('leads')
            .insert({
                name: fullName,
                email,
                phone: whatsappNumber || '0000000000',
                source_quiz_id: null,
                source_path: SOURCE_TAG,
                user_agent: encodedUa
            })
            .select('id')
            .single();

        if (error) {
            console.error('[fixourneet] insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const origin = req.headers.get('origin') || `https://${req.headers.get('host')}`;
        const emailResult = await sendVerificationEmail({ to: email, name: fullName, token, origin });

        return NextResponse.json({
            ok: true,
            signature_id: data.id,
            message: emailResult.sent
                ? 'Check your inbox to verify your signature.'
                : 'Signature recorded. Verification email is pending — we will follow up shortly.'
        });

    } catch (err: any) {
        console.error('[fixourneet] sign error:', err);
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
