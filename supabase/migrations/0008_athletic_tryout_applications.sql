create table if not exists public.athletic_tryout_applications (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  campus text not null check (campus in ('santa_monica', 'palo_alto')),
  sport text not null check (sport in ('football', 'basketball', 'soccer')),
  tryout_session text not null check (tryout_session in ('june_10', 'november_12')),
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text not null,
  age_group text not null check (age_group in ('under_18', 'adult')),
  guardian_name text,
  guardian_email text,
  health_participation_notes text,
  insurance_status text not null check (insurance_status in ('insured', 'not_insured', 'discuss_privately')),
  insurance_provider text,
  insurance_member_last4 text check (insurance_member_last4 is null or insurance_member_last4 ~ '^\d{4}$'),
  athletic_history text not null,
  evidence_path text not null,
  evidence_filename text not null,
  evidence_kind text not null check (evidence_kind in ('resume', 'video')),
  brochure_path text not null,
  consented_at timestamp with time zone not null,
  status text not null default 'notification_pending',
  created_at timestamp with time zone not null default now()
);

alter table public.athletic_tryout_applications enable row level security;

insert into storage.buckets (id, name, public)
values ('tryout-applications', 'tryout-applications', false)
on conflict (id) do nothing;

comment on table public.athletic_tryout_applications is
  'Private AI Pioneers Sharks tryout applications. Access is limited to server-side authorized reviewers; no public RLS policies are defined.';
