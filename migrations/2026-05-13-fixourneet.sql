-- ============================================================================
-- Migration: Fix Our NEET signatures table
-- Date: 2026-05-13
-- Run this in Supabase SQL Editor:
--   https://supabase.com/dashboard/project/tfvkbxojijilnptvhsmb/sql/new
-- ============================================================================

create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Identity
  full_name text not null,
  email text not null,
  city text not null,
  state text not null,

  -- Role
  role text not null check (role in ('candidate','parent','educator','supporter')),

  -- Candidate-only fields
  neet_attempt text check (neet_attempt in ('first','dropper_1','dropper_2plus','repeater')),
  class_12_passing_year int,
  target_year int check (target_year in (2026, 2027)),
  preferred_medium text check (preferred_medium in ('english','hindi','other')),
  state_board text,
  neet_app_number_last4 text,

  -- Consent and verification
  otp_verified boolean not null default false,
  otp_token text,
  otp_sent_at timestamptz,
  otp_verified_at timestamptz,

  -- Minor handling
  is_minor boolean not null default false,
  parent_name text,
  parent_consent boolean not null default false,

  -- Marketing consent (DPDP s.6(1))
  desi_educators_optin boolean not null default false,
  whatsapp_number text,
  whatsapp_consent boolean not null default false,

  -- Privacy
  privacy_consent boolean not null default false,

  -- Metadata
  ip_hash text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create unique index if not exists signatures_email_unique on public.signatures (lower(email));
create index if not exists signatures_verified_idx on public.signatures (otp_verified, role);
create index if not exists signatures_created_at_idx on public.signatures (created_at desc);
create index if not exists signatures_otp_token_idx on public.signatures (otp_token) where otp_token is not null;

-- RLS
alter table public.signatures enable row level security;

-- Drop existing policies if re-running
drop policy if exists "anon_insert" on public.signatures;
drop policy if exists "no_anon_select" on public.signatures;

-- Anonymous insert allowed (form submission)
create policy "anon_insert" on public.signatures
  for insert to anon
  with check (true);

-- No anonymous select on raw data; counts via RPC only
create policy "no_anon_select" on public.signatures
  for select to anon
  using (false);

-- ============================================================================
-- RPC for live counts (security definer so anon can call but never read rows)
-- ============================================================================

create or replace function public.petition_counts()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total', (select count(*) from public.signatures where otp_verified = true),
    'verified_candidates', (select count(*) from public.signatures where otp_verified = true and role = 'candidate'),
    'parents', (select count(*) from public.signatures where otp_verified = true and role = 'parent'),
    'educators', (select count(*) from public.signatures where otp_verified = true and role = 'educator'),
    'supporters', (select count(*) from public.signatures where otp_verified = true and role = 'supporter'),
    'last_24h', (select count(*) from public.signatures where otp_verified = true and created_at > now() - interval '24 hours')
  );
$$;

grant execute on function public.petition_counts() to anon;
grant execute on function public.petition_counts() to authenticated;

-- ============================================================================
-- Done. Verify:
--   select * from public.petition_counts();
--   should return: {"total":0,"verified_candidates":0,...}
-- ============================================================================
