-- Digital-UNI schema — 0002: courses, licensing, translation workflow
-- Implements Section 9 (Course Discovery), Section 10 (Authorized Content
-- Sources), Section 11 (Translation Workflow).

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null, -- canonical (English) label; UI translations live in messages/*.json by key
  parent_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  institution_id uuid references public.institutions (id) on delete set null,
  provider_id uuid references public.providers (id) on delete set null,
  primary_instructor_id uuid references public.instructors (id) on delete set null,
  prerequisites text,
  learning_outcomes text[],
  estimated_duration_minutes integer,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  original_language text not null default 'en',
  subtitle_languages text[] not null default '{}',
  translation_status translation_status not null default 'original_language_only',
  content_format content_format not null default 'video',
  is_free boolean not null default true,
  has_certificate boolean not null default false,
  certificate_provider text, -- who actually issues it; never Digital-UNI unless is_digital_uni_original
  is_digital_uni_original boolean not null default false,
  original_course_url text,
  authorized_embed_url text, -- only populated when license permits embedding
  copyright_notice text not null default
    'This course remains the property of its original provider. Digital-UNI does not claim ownership.',
  authorization_status authorization_status not null default 'unverified',
  publication_status publication_status not null default 'draft',
  last_verification_date date,
  is_demonstration boolean not null default false,
  created_by uuid references public.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index courses_publication_status_idx on public.courses (publication_status);
create index courses_authorization_status_idx on public.courses (authorization_status);
create index courses_institution_id_idx on public.courses (institution_id);

create table public.course_categories (
  course_id uuid not null references public.courses (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (course_id, category_id)
);

-- Section 10: every imported record enters a moderation queue and records
-- source/import metadata separately from the published course row.
create table public.course_sources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  source_identifier text not null, -- e.g. YouTube video id, edX course key
  canonical_url text not null,
  provider_id uuid references public.providers (id) on delete set null,
  raw_metadata jsonb not null default '{}'::jsonb,
  import_method import_method not null,
  imported_by uuid references public.users (id),
  reviewed_by uuid references public.users (id),
  publication_status publication_status not null default 'pending_review',
  last_verification_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index course_sources_publication_status_idx on public.course_sources (publication_status);

create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete cascade,
  provider_id uuid references public.providers (id) on delete cascade,
  license_type text not null, -- e.g. 'CC-BY', 'proprietary-link-only', 'proprietary-embed-permitted'
  permits_linking boolean not null default true,
  permits_embedding boolean not null default false,
  permits_translation boolean not null default false,
  permits_download boolean not null default false,
  evidence_url text,
  reviewed_by uuid references public.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_permissions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  permission_type text not null check (permission_type in ('embed', 'translate', 'caption_download', 'transcript')),
  is_granted boolean not null default false,
  granted_by uuid references public.users (id),
  license_id uuid references public.licenses (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Section 11 translation workflow
create table public.translations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  target_language text not null check (target_language in ('ar', 'fr')),
  status translation_status not null default 'translation_requested',
  transcript_text text,
  ai_summary text,
  glossary jsonb not null default '{}'::jsonb,
  requested_by uuid references public.users (id),
  assigned_translator_id uuid references public.users (id),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subtitle_files (
  id uuid primary key default gen_random_uuid(),
  translation_id uuid not null references public.translations (id) on delete cascade,
  format text not null check (format in ('srt', 'vtt')),
  storage_path text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.translation_reviews (
  id uuid primary key default gen_random_uuid(),
  translation_id uuid not null references public.translations (id) on delete cascade,
  reviewer_id uuid not null references public.users (id),
  decision text not null check (decision in ('approved', 'rejected', 'changes_requested')),
  notes text,
  segment_reference text, -- e.g. timestamp range or subtitle cue id
  created_at timestamptz not null default now()
);

create index translations_course_id_idx on public.translations (course_id);
create index translations_status_idx on public.translations (status);
