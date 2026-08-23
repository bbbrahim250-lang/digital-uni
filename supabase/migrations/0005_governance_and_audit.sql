-- Digital-UNI schema — 0005: copyright removal, contact, audit trail
-- Implements Section 4 (copyright-removal process) and Section 15
-- (administrative audit trail).

create table public.copyright_requests (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete set null,
  submitted_by_name text not null,
  submitted_by_email text not null,
  claim_description text not null,
  evidence_url text,
  status text not null default 'received' check (status in ('received', 'in_review', 'upheld', 'denied', 'content_removed')),
  handled_by uuid references public.users (id),
  resolution_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  locale text not null default 'en',
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

-- Administrative audit trail — Section 15. Append-only by convention
-- (no update/delete policy is granted to any role below).
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users (id),
  action text not null, -- e.g. 'course.approved', 'translation.published', 'credential.revoked'
  entity_table text not null,
  entity_id uuid not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_entity_idx on public.audit_events (entity_table, entity_id);
create index audit_events_actor_idx on public.audit_events (actor_id);
