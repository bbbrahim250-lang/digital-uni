create table if not exists public.applicant_plans (
  id uuid primary key default gen_random_uuid(), reference text unique not null,
  applicant_name text not null, applicant_email text not null, preferred_language text not null,
  financial_aid_requested boolean not null default false, installment_preference text not null,
  plan jsonb not null, brochure_path text not null, consented_at timestamptz not null,
  status text not null default 'notification_pending', created_at timestamptz not null default now()
);
alter table public.applicant_plans enable row level security;
insert into storage.buckets (id, name, public) values ('applicant-brochures', 'applicant-brochures', false) on conflict (id) do nothing;
-- Applicants cannot read this table or bucket directly. Trusted server routes use the service role.
