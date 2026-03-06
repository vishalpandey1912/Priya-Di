import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const [subjectsRes, chaptersRes, topicsRes, materialsRes, quizzesRes] = await Promise.all([
            supabaseAdmin.from('subjects').select('*').order('order_index', { ascending: true }).order('created_at', { ascending: true }),
            supabaseAdmin.from('chapters').select('*').order('created_at', { ascending: true }),
            supabaseAdmin.from('topics').select('*').order('created_at', { ascending: true }),
            supabaseAdmin.from('materials').select('*').order('created_at', { ascending: true }),
            supabaseAdmin.from('quizzes').select('id, topic_id, title, duration_minutes, price, created_at'),
        ]);

        if (subjectsRes.error) throw subjectsRes.error;
        if (chaptersRes.error) throw chaptersRes.error;
        if (topicsRes.error) throw topicsRes.error;
        if (materialsRes.error) throw materialsRes.error;

        return NextResponse.json({
            subjects: subjectsRes.data,
            chapters: chaptersRes.data,
            topics: topicsRes.data,
            materials: materialsRes.data,
            quizzes: quizzesRes.data || [],
        });
    } catch (error: any) {
        console.error('Content API Error:', error);
        return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    }
}
