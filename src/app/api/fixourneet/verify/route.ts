import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/fixourneet/verify?token=...
 * Verifies a signature via the OTP token sent by email.
 * Redirects to /fixourneet/thank-you on success, or back to /fixourneet with error.
 */
export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const token = req.nextUrl.searchParams.get('token');

    if (!token || token.length < 16) {
        return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
    }

    try {
        const { data: row, error } = await supabaseAdmin
            .from('signatures')
            .select('id, otp_sent_at, otp_verified')
            .eq('otp_token', token)
            .maybeSingle();

        if (error) {
            console.error('[fixourneet] verify lookup error:', error);
            return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
        }
        if (!row) {
            return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
        }
        if (row.otp_verified) {
            return NextResponse.redirect(`${origin}/fixourneet/thank-you?already=1`);
        }

        const sentAt = row.otp_sent_at ? new Date(row.otp_sent_at).getTime() : 0;
        if (Date.now() - sentAt > 48 * 60 * 60 * 1000) {
            return NextResponse.redirect(`${origin}/fixourneet?error=expired_token`);
        }

        const { error: upErr } = await supabaseAdmin
            .from('signatures')
            .update({
                otp_verified: true,
                otp_verified_at: new Date().toISOString(),
                otp_token: null
            })
            .eq('id', row.id);

        if (upErr) {
            console.error('[fixourneet] verify update error:', upErr);
            return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
        }

        return NextResponse.redirect(`${origin}/fixourneet/thank-you`);
    } catch (e) {
        console.error('[fixourneet] verify exception:', e);
        return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
    }
}
