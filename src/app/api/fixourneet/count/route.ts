import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const revalidate = 30; // seconds

/**
 * GET /api/fixourneet/count
 * Returns aggregated counts of verified signatories.
 * Cached for 30 seconds.
 */
export async function GET(_req: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin.rpc('petition_counts');

        if (error) {
            console.error('[fixourneet] count rpc error:', error);
            // Fallback: zeroes
            return NextResponse.json({
                total: 0, verified_candidates: 0, parents: 0,
                educators: 0, supporters: 0, last_24h: 0,
                _note: 'counts unavailable'
            }, {
                headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
            });
        }

        return NextResponse.json(data, {
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
