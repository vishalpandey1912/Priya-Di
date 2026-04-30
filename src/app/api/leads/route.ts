import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * POST /api/leads
 * Captures name + email + phone before allowing quiz access.
 * No auth, no password — just contact info for follow-up.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source_quiz_id, source_path } = body;

    // Validate
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Please enter your phone number.' }, { status: 400 });
    }
    // Strip spaces, dashes
    const phoneClean = phone.replace(/[\s\-()]/g, '');
    // Need at least 10 digits (allow + for country code)
    if (!phoneClean.match(/^\+?\d{10,15}$/)) {
      return NextResponse.json({ error: 'Please enter a valid phone number (10+ digits).' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || null;

    // Insert lead. Even if same email exists, store every attempt — these are
    // engagement signals not unique constraint violations.
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phoneClean,
        source_quiz_id: source_quiz_id || null,
        source_path: source_path || null,
        user_agent: userAgent
      })
      .select('id')
      .single();

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead_id: data.id });
  } catch (err: any) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
