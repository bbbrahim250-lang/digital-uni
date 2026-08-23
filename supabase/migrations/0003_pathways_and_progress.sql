-- Digital-UNI schema — 0003: pathways, enrollment, progress, assessments
-- Implements Section 12 (Learning Pathways) and Section 13 (Student Dashboard).

create table public.pathways (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  skills text[] not null default '{}',
  prerequisites text,
  estimated_completion_hours integer,
  authorization_status authorization_status not null default 'unverified',
  publication_status publication_status not null default 'draft',
  badge_eligible boolean not null default false,
  external_examination_links jsonb not null default '[]'::jsonb,
  authorization_disclaimer text,
  is_demonstration boolean not null default false,
  created_by uuid references public.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.pathway_courses (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid not null references public.pathways (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  is_required boolean not null default true,
  recommended_order integer not null default 0,
  unique (pathway_id, course_id)
);

create index pathway_courses_pathway_id_idx on public.pathway_courses (pathway_id, recommended_order);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  pathway_id uuid references public.pathways (id) on delete cascade,
  course_id uuid references public.courses (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  check (pathway_id is not null or course_id is not null)
);

create index enrollments_user_id_idx on public.enrollments (user_id);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  module_reference text not null, -- opaque reference into course/pathway structure
  percent_complete integer not null default 0 check (percent_complete between 0 and 100),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz
);

create index progress_enrollment_id_idx on public.progress (enrollment_id);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete cascade,
  pathway_id uuid references public.pathways (id) on delete cascade,
  title text not null,
  passing_score integer not null default 70,
  created_by uuid references public.users (id),
  created_at timestamptz not null default now(),
  check (course_id is not null or pathway_id is not null)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  prompt text not null,
  question_type text not null check (question_type in ('multiple_choice', 'short_answer', 'code')),
  options jsonb, -- for multiple_choice
  correct_answer jsonb,
  order_index integer not null default 0
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer,
  passed boolean,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index attempts_user_id_idx on public.attempts (user_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete cascade,
  pathway_id uuid references public.pathways (id) on delete cascade,
  title text not null,
  instructions text,
  rubric jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id),
  created_at timestamptz not null default now()
);

create table public.student_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  content_url text,
  content_text text,
  status text not null default 'submitted' check (status in ('submitted', 'in_review', 'approved', 'needs_revision')),
  reviewer_id uuid references public.users (id),
  reviewer_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index student_submissions_user_id_idx on public.student_submissions (user_id);
