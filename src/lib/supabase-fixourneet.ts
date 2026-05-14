/**
 * Fix Our NEET — Supabase client (points to Santosh's pedagogy-audit project)
 *
 * IMPORTANT: This config is INTENTIONALLY HARDCODED (not in env vars).
 *
 * - The Supabase URL and ANON key are designed to be PUBLIC. Every Next.js +
 *   Supabase site ships the anon key inside the browser JS bundle.
 * - Security is enforced by:
 *     (a) RLS policies on the `signatures` table (anon can INSERT only)
 *     (b) SECURITY DEFINER RPCs (`verify_signature_by_token`, `petition_counts`)
 *     (c) An Edge Function for email delivery, with the Resend key as a Supabase
 *         project secret that only the function runtime can read.
 *
 * - Why hardcoded? Because the production Vercel deployment is on Vishal's team,
 *   and we don't have access to set env vars there. Hardcoding the public URL
 *   and anon key works because they ARE public by design. The service-role key
 *   never touches this codebase — privileged operations all go via the RPCs
 *   on Santosh's Supabase project.
 *
 * - This file is fully OWNED by Santosh: his Supabase, his Edge Function,
 *   his Resend account. Vishal cannot read or modify any petition data.
 */

import { createClient } from '@supabase/supabase-js';

export const FIXOURNEET_SUPABASE_URL = 'https://pzopxazxpzfjxzudshcl.supabase.co';

// Anon JWT — public by design, protected by RLS. Safe to commit.
export const FIXOURNEET_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6b3B4YXp4cHpmanh6dWRzaGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTU0NTgsImV4cCI6MjA5Mjc5MTQ1OH0.utOxh_HqfPiElCrdUxG1NMs3FRNUtiJL606KQxhOLaE';

export const supabaseFixourneet = createClient(
    FIXOURNEET_SUPABASE_URL,
    FIXOURNEET_SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Edge function URL — invoked from sign route to send verification email
export const FIXOURNEET_EDGE_SEND_EMAIL =
    `${FIXOURNEET_SUPABASE_URL}/functions/v1/send-petition-verify`;
