-- Digital-UNI schema — 0004: badges, credentials, accreditation, CTE, FAA
-- Implements Sections 16, 17, 18, 20, 21.

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  pathway_id uuid references public.pathways (id) on delete set null,
  icon_url text,
  created_at timestamptz not null default now()
);

-- Section 20: credential verification. `protected_student_identifier` is a
-- non-guessable reference (not the raw user id/email) exposed on the public
-- verification page; personal data stays out of the publicly queried row.
create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  badge_id uuid references public.badges (id) on delete set null,
  protected_student_identifier text not null unique default encode(gen_random_bytes(9), 'base64'),
  certificate_title text not null,
  issuer text not null default 'Digital-UNI', -- external credentials store the real issuer here
  issue_date date not null default current_date,
  expiration_date date,
  credential_number text not null unique,
  qr_code_url text,
  program_status program_status not null default 'concept_under_development',
  authorization_status authorization_status not null default 'unverified',
  is_revoked boolean not null default false,
  revoked_reason text,
  external_issuer_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index credentials_user_id_idx on public.credentials (user_id);

create table public.credential_verification (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid not null references public.credentials (id) on delete cascade,
  verified_at timestamptz not null default now(),
  verifier_ip_hash text -- store a hash, not the raw IP, per Section 24 privacy minimization
);

create table public.accreditation_programs (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid references public.pathways (id) on delete set null,
  program_name text not null,
  jurisdiction text,
  status program_status not null default 'concept_under_development',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accreditation_evidence (
  id uuid primary key default gen_random_uuid(),
  accreditation_program_id uuid not null references public.accreditation_programs (id) on delete cascade,
  evidence_type text not null, -- e.g. 'curriculum_review', 'faculty_review', 'compliance_document'
  document_url text,
  submitted_by uuid references public.users (id),
  submitted_at timestamptz not null default now()
);

create table public.partnership_proposals (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions (id) on delete set null,
  proposal_type text not null, -- e.g. 'articulation_agreement', 'dual_enrollment', 'transfer_credit'
  status program_status not null default 'concept_under_development',
  contact_name text,
  contact_email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cte_programs (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid references public.pathways (id) on delete set null,
  program_name text not null,
  jurisdiction text not null,
  state_standards text,
  industry_competencies text[] not null default '{}',
  work_based_learning text,
  capstone_requirements text,
  advisory_board_review text,
  instructor_qualifications text,
  employability_skills text[] not null default '{}',
  certification_alignment text,
  approval_status program_status not null default 'concept_under_development',
  renewal_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Section 17: FAA Future AI Air-Traffic Controller Program
create table public.faa_programs (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid references public.pathways (id) on delete set null,
  program_name text not null default 'Proposed Digital-UNI FAA AI Controller Training and Simulation Program',
  curriculum_roadmap jsonb not null default '[]'::jsonb,
  disclaimer text not null default
    'Subject to FAA review, authorization, and applicable certification requirements. Digital-UNI training is not an FAA license or certification unless formal authorization is obtained.',
  status program_status not null default 'concept_under_development',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
