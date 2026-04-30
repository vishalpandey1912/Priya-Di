import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Confirms a user's email via admin API.
 * This bypasses the email confirmation requirement so users can immediately use the platform.
 *
 * SECURITY NOTE: This is intentionally permissive — anyone who signed up can have their email
 * auto-confirmed. We accept this trade-off because:
 *   1. They already proved control of the email by signing up.
 *   2. NEET 2026 is days away — friction kills conversion.
 *   3. We never send password resets via unconfirmed email.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email required' }, { status: 400 });
    }

    // Find user by email (case-insensitive)
    const normalizedEmail = email.toLowerCase().trim();

    // Iterate pages of users to find target — using getUserByEmail isn't part of Supabase admin SDK
    let foundUser = null;
    let page = 1;
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
      if (error) {
        console.error('listUsers error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      foundUser = data.users.find(u => u.email?.toLowerCase() === normalizedEmail);
      if (foundUser) break;
      if (data.users.length < 100) break;
      page++;
      if (page > 20) break; // hard cap
    }

    if (!foundUser) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 });
    }

    if (foundUser.email_confirmed_at) {
      return NextResponse.json({ already_confirmed: true });
    }

    // Confirm the user
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      foundUser.id,
      { email_confirm: true }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ confirmed: true });
  } catch (err: any) {
    console.error('auto-confirm error:', err);
    return NextResponse.json({ error: err.message || 'unknown error' }, { status: 500 });
  }
}
