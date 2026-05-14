import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const revalidate = 30;

/**
 * GET /api/fixourneet/count
 *
 * Aggregates verified signatures from leads table where source_path='/fixourneet'
 * and the embedded petition JSON has otp_verified=true.
 * Caches result for 30 seconds.
 */
export async function GET(_req: NextRequest) {
    try {
        // Fetch all fixourneet rows (we need to parse the JSON to count by role)
        // For scale this is fine until ~50k rows; we can move to RPC if it grows.
        const { data: rows, error } = await supabaseAdmin
            .from('leads')
            .select('user_agent, captured_at')
            .eq('source_path', '/fixourneet');

        if (error) {
            console.error('[fixourneet] count select error:', error);
            return NextResponse.json({
                total: 0, verified_candidates: 0, parents: 0,
                educators: 0, supporters: 0, last_24h: 0,
                _note: 'counts unavailable'
            });
        }

        const counts = {
            total: 0,
            verified_candidates: 0,
            parents: 0,
            educators: 0,
            supporters: 0,
            last_24h: 0
        };

        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;

        for (const r of (rows || [])) {
            try {
                const ua = r.user_agent || '';
                const idx = ua.indexOf('{"schema":"fixourneet_v1"');
                if (idx < 0) continue;
                const data = JSON.parse(ua.slice(idx));
                if (!data.otp_verified) continue;

                counts.total += 1;
                if (data.role === 'candidate') counts.verified_candidates += 1;
                else if (data.role === 'parent') counts.parents += 1;
                else if (data.role === 'educator') counts.educators += 1;
                else if (data.role === 'supporter') counts.supporters += 1;

                const capturedMs = r.captured_at ? new Date(r.captured_at).getTime() : 0;
                if (capturedMs > dayAgo) counts.last_24h += 1;
            } catch {}
        }

        return NextResponse.json(counts, {
            headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
        });
    } catch (e: any) {
        console.error('[fixourneet] count exception:', e);
        return NextResponse.json({
            total: 0, verified_candidates: 0, parents: 0,
            educators: 0, supporters: 0, last_24h: 0,
            _note: 'counts unavailable'
        });
    }
}
