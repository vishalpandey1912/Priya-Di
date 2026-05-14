import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/fixourneet/verify?token=...
 *
 * Reads from leads table (where source_path='/fixourneet'), parses petition JSON
 * embedded in user_agent, validates token, marks otp_verified=true.
 */
export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const token = req.nextUrl.searchParams.get('token');

    if (!token || token.length < 16) {
        return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
    }

    try {
        // Fetch all fixourneet rows whose user_agent contains this token
        // (we use ilike on user_agent — token is unique enough to filter cleanly)
        const { data: rows, error } = await supabaseAdmin
            .from('leads')
            .select('id, user_agent, email')
            .eq('source_path', '/fixourneet')
            .ilike('user_agent', `%${token}%`)
            .limit(5);

        if (error) {
            console.error('[fixourneet] verify lookup error:', error);
            return NextResponse.redirect(`${origin}/fixourneet?error=server_error`);
        }
        if (!rows || rows.length === 0) {
            return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
        }

        // Find exact match
        let matchedRow: any = null;
        let matchedData: any = null;
        for (const row of rows) {
            try {
                const ua = row.user_agent || '';
                const idx = ua.indexOf('{"schema":"fixourneet_v1"');
                if (idx < 0) continue;
                const data = JSON.parse(ua.slice(idx));
                if (data.otp_token === token) {
                    matchedRow = row;
                    matchedData = data;
                    break;
                }
            } catch {}
        }

        if (!matchedRow || !matchedData) {
            return NextResponse.redirect(`${origin}/fixourneet?error=invalid_token`);
        }

        if (matchedData.otp_verified) {
            return NextResponse.redirect(`${origin}/fixourneet/thank-you?already=1`);
        }

        // Check token age (48 hours)
        const sentAt = matchedData.otp_sent_at ? new Date(matchedData.otp_sent_at).getTime() : 0;
        if (Date.now() - sentAt > 48 * 60 * 60 * 1000) {
            return NextResponse.redirect(`${origin}/fixourneet?error=expired_token`);
        }

        // Mark verified — keep token in the JSON for audit but flip otp_verified=true
        matchedData.otp_verified = true;
        matchedData.otp_verified_at = new Date().toISOString();
        matchedData.otp_token = null;  // clear token after use

        const realUa = (matchedRow.user_agent || '').split(' | PETITION=')[0];
        const newUa = `${realUa} | PETITION=${JSON.stringify(matchedData)}`;

        const { error: upErr } = await supabaseAdmin
            .from('leads')
            .update({ user_agent: newUa })
            .eq('id', matchedRow.id);

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
