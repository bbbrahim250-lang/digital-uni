-- Digital-UNI schema — 0001: enums, identity, institutions
-- Section 22 (Database Model). All tables use UUID PKs, created/updated
-- timestamps, soft deletion where appropriate, and publication/authorization
-- status fields as specified.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type app_role as enum (
  'student',
  'instructor',
  'translator',
  'reviewer',
  'content_manager',
  'compliance_administrator',
  'accreditation_administrator',
  'super_administrator'
);

-- Section 4: authorization status shown on every external program
create type authorization_status as enum (
  'unverified',
  'public_information',
  'licensed_for_linking',
  'licensed_for_embedding',
  'licensed_for_translation',
  'official_partnership_proposed',
  'application_in_progress',
  'institutionally_approved',
  'accredited_or_credit_bearing',
  'suspended',
  'removed'
);

create type publication_status as enum (
  'draft',
  'pending_review',
  'published',
  'rejected',
  'withdrawn'
);

create type translation_status as enum (
  'original_language_only',
  'translation_requested',
  'machine_translation_pending_review',
  'human_review_in_progress',
  'human_reviewed_arabic',
  'human_reviewed_french',
  'approved_for_publication',
  'translation_unavailable_licensing',
  'translation_withdrawn'
);

create type program_status as enum (
  'concept_under_development',
  'partnership_proposed',
  'application_in_progress',
  'institutionally_approved',
  'accredited_or_credit_bearing',
  'suspended',
  'expired'
);

create type content_format as enum (
  'video', 'reading', 'laboratory', 'assessment', 'project_based', 'hybrid'
);

create type import_method as enum (
  'youtube_api', 'edx_catalog', 'mit_ocw_feed', 'harvard_public_listing',
  'stanford_public_listing', 'other_authorized_api', 'manual_admin_submission'
);

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

-- `users` mirrors auth.users (Supabase-managed); we keep a thin FK'd row so
-- other tables can reference a stable app-level id without touching auth schema.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  display_name text not null,
  preferred_locale text not null default 'en' check (preferred_locale in ('en', 'ar', 'fr')),
  accessibility_preferences jsonb not null default '{}'::jsonb,
  subtitle_preferences jsonb not null default '{}'::jsonb,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  role app_role not null,
  granted_by uuid references public.users (id),
  granted_at timestamptz not null default now(),
  unique (user_id, role)
);

create index roles_user_id_idx on public.roles (user_id);

-- ---------------------------------------------------------------------------
-- Institutions, providers, instructors
-- ---------------------------------------------------------------------------

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  website_url text,
  logo_url text,
  country text,
  authorization_status authorization_status not null default 'unverified',
  is_demonstration boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions (id) on delete set null,
  name text not null,
  slug text not null unique,
  provider_type text not null, -- e.g. 'university', 'mooc_platform', 'certification_body'
  api_connector text,          -- e.g. 'youtube_data_api', 'edx_catalog', 'manual'
  authorization_status authorization_status not null default 'unverified',
  is_demonstration boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions (id) on delete set null,
  full_name text not null,
  bio text,
  photo_url text,
  external_profile_url text,
  is_digital_uni_instructor boolean not null default false, -- true only for original DUNI courses
  linked_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
