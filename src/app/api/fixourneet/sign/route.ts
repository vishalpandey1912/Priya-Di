import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/fixourneet/sign
 * Captures a signature for the Fix Our NEET petition.
 * Sends OTP verification email.
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

    // Try Resend if API key is set
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
                    from: 'Fix Our NEET <fixourneet@desieducators.com>',
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

    // Fallback: log the verification URL so it can be manually delivered if email fails.
    console.warn(`[fixourneet] EMAIL FALLBACK — no working provider. Verify URL for ${opts.to}:`);
    console.warn(`  ${verifyUrl}`);
    return { sent: false, provider: 'console' };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Required
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
            return NextResponse.json({ error: 'Privacy consent is required to print your name on the petition.' }, { status: 400 });
        }

        // Candidate-specific validation
        let candidateFields: any = {};
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

        // Minor handling
        const isMinor = !!body.is_minor;
        if (isMinor) {
            if (!body.parent_name || !body.parent_consent) {
                return NextResponse.json({ error: 'Parent name and consent are required for signatories under 18.' }, { status: 400 });
            }
        }

        // WhatsApp consent
        const whatsappNumber = (body.whatsapp_number || '').trim() || null;
        if (whatsappNumber && !body.whatsapp_consent) {
            return NextResponse.json({ error: 'Please confirm WhatsApp consent, or leave the number blank.' }, { status: 400 });
        }

        // Metadata
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || req.headers.get('x-real-ip')
            || '0.0.0.0';
        const userAgent = req.headers.get('user-agent') || null;

        // Check existing
        const { data: existing } = await supabaseAdmin
            .from('signatures')
            .select('id, otp_verified, otp_sent_at')
            .ilike('email', email)
            .maybeSingle();

        if (existing) {
            if (existing.otp_verified) {
                return NextResponse.json({
                    ok: true,
                    alreadyVerified: true,
                    message: 'This email has already verified a signature. Thank you!'
                });
            }
            // Rate limit: max 1 resend per 10 min
            if (existing.otp_sent_at) {
                const lastSent = new Date(existing.otp_sent_at).getTime();
                if (Date.now() - lastSent < 10 * 60 * 1000) {
                    return NextResponse.json({
                        ok: true,
                        message: 'A verification email was just sent. Please check your inbox (including spam).'
                    });
                }
            }
            // Regenerate token
            const token = generateToken();
            await supabaseAdmin.from('signatures').update({
                otp_token: token,
                otp_sent_at: new Date().toISOString()
            }).eq('id', existing.id);

            const origin = req.headers.get('origin') || `https://${req.headers.get('host')}`;
            await sendVerificationEmail({ to: email, name: fullName, token, origin });
            return NextResponse.json({ ok: true, message: 'Check your inbox to verify your signature.' });
        }

        // Insert new signature
        const token = generateToken();
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
            otp_sent_at: new Date().toISOString(),
            ip_hash: hashIp(ip),
            user_agent: userAgent,
            utm_source: body.utm_source || null,
            utm_medium: body.utm_medium || null,
            utm_campaign: body.utm_campaign || null
        };

        const { data, error } = await supabaseAdmin
            .from('signatures')
            .insert(insertPayload)
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
                : 'Signature recorded. Verification email is pending — please check back.',
            // In dev only — never expose token in production payload
            ...(process.env.NODE_ENV !== 'production' ? { _devToken: token } : {})
        });

    } catch (err: any) {
        console.error('[fixourneet] sign error:', err);
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
