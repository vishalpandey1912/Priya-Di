import { NextRequest, NextResponse } from 'next/server';
import { supabaseFixourneet } from '@/lib/supabase-fixourneet';

export const runtime = 'nodejs';
export const revalidate = 30;

/**
 * GET /api/fixourneet/count
 * Calls the petition_counts() RPC on Santosh's Supabase.
 * Cached at the CDN edge for 30 seconds.
 */
export async function GET(_req: NextRequest) {
    try {
        const { data, error } = await supabaseFixourneet.rpc('petition_counts');
        if (error) {
            console.error('[fixourneet/count] RPC error:', error);
            return NextResponse.json({
                total: 0, verified_candidates: 0, parents: 0,
                educators: 0, supporters: 0, last_24h: 0,
                _note: 'counts unavailable'
            }, {
                headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
            });
        }
        return NextResponse.json(data || {
            total: 0, verified_candidates: 0, parents: 0,
            educators: 0, supporters: 0, last_24h: 0
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
        });
    } catch (e: any) {
        console.error('[fixourneet/count] exception:', e);
        return NextResponse.json({
            total: 0, verified_candidates: 0, parents: 0,
            educators: 0, supporters: 0, last_24h: 0,
            _note: 'counts unavailable'
        });
    }
}
