import { NextRequest, NextResponse } from 'next/server';
import { supabaseFixourneet } from '@/lib/supabase-fixourneet';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/fixourneet/verify?token=...
 * Calls the security-definer RPC verify_signature_by_token on Santosh's Supabase.
 * Redirects to /thank-you on success or /fixourneet?error=... on failure.
 */
export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const token = req.nextUrl.searchParams.get('token');

    if (!token || token.length < 16) {
        return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
    }

    try {
        const { data, error } = await supabaseFixourneet
            .rpc('verify_signature_by_token', { p_token: token });

        if (error) {
            console.error('[fixourneet/verify] RPC error:', error);
            return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
        }

        // RPC returns one of: 'verified', 'already', 'expired', 'invalid'
        const result = String(data || '').trim();
        if (result === 'verified') {
            return NextResponse.redirect(`${origin}/fixourneet/thank-you`);
        }
        if (result === 'already') {
            return NextResponse.redirect(`${origin}/fixourneet/thank-you?already=1`);
        }
        if (result === 'expired') {
            return NextResponse.redirect(`${origin}/fixourneet?error=expired_token`);
        }
        return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
    } catch (e) {
        console.error('[fixourneet/verify] exception:', e);
        return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
    }
}
