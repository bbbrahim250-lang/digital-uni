-- Digital-UNI schema — 0006: row-level security
-- Section 15 (RBAC), Section 24 (row-level security), Section 4 (only
-- authorized administrators may assign approval/accreditation/credit-bearing
-- status).

-- Helper: does the current auth.uid() hold a given role (or super_administrator)?
create or replace function public.has_role(check_role app_role)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.roles
    where user_id = auth.uid()
      and (role = check_role or role = 'super_administrator')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.roles
    where user_id = auth.uid()
      and role in ('content_manager', 'compliance_administrator', 'accreditation_administrator', 'super_administrator')
  );
$$;

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.institutions enable row level security;
alter table public.providers enable row level security;
alter table public.instructors enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.course_categories enable row level security;
alter table public.course_sources enable row level security;
alter table public.licenses enable row level security;
alter table public.content_permissions enable row level security;
alter table public.translations enable row level security;
alter table public.subtitle_files enable row level security;
alter table public.translation_reviews enable row level security;
alter table public.pathways enable row level security;
alter table public.pathway_courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.assessments enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.projects enable row level security;
alter table public.student_submissions enable row level security;
alter table public.badges enable row level security;
alter table public.credentials enable row level security;
alter table public.credential_verification enable row level security;
alter table public.accreditation_programs enable row level security;
alter table public.accreditation_evidence enable row level security;
alter table public.partnership_proposals enable row level security;
alter table public.cte_programs enable row level security;
alter table public.faa_programs enable row level security;
alter table public.copyright_requests enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.audit_events enable row level security;

-- ---------------------------------------------------------------------------
-- Identity: users only see/edit their own row; admins see all.
-- ---------------------------------------------------------------------------
create policy users_select_own on public.users for select using (id = auth.uid() or public.is_admin());
create policy users_update_own on public.users for update using (id = auth.uid());

create policy profiles_select_own on public.profiles for select using (user_id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update using (user_id = auth.uid());
create policy profiles_insert_own on public.profiles for insert with check (user_id = auth.uid());

-- Roles: only super_administrator may grant/revoke roles.
create policy roles_select on public.roles for select using (user_id = auth.uid() or public.is_admin());
create policy roles_write on public.roles for all
  using (public.has_role('super_administrator'))
  with check (public.has_role('super_administrator'));

-- ---------------------------------------------------------------------------
-- Public catalog content: anyone (incl. anonymous) may read published rows;
-- only content_manager+ may write. Authorization/accreditation status fields
-- are only ever mutated through these same admin-gated write policies —
-- Section 4's "only authorized administrators may assign approval status".
-- ---------------------------------------------------------------------------
create policy institutions_public_read on public.institutions for select using (deleted_at is null);
create policy institutions_admin_write on public.institutions for all
  using (public.is_admin()) with check (public.is_admin());

create policy providers_public_read on public.providers for select using (deleted_at is null);
create policy providers_admin_write on public.providers for all
  using (public.is_admin()) with check (public.is_admin());

create policy instructors_public_read on public.instructors for select using (deleted_at is null);
create policy instructors_admin_write on public.instructors for all
  using (public.is_admin()) with check (public.is_admin());

create policy categories_public_read on public.categories for select using (true);
create policy categories_admin_write on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy courses_public_read on public.courses for select
  using (publication_status = 'published' and deleted_at is null);
create policy courses_owner_read on public.courses for select
  using (created_by = auth.uid() or public.is_admin() or public.has_role('instructor'));
create policy courses_admin_write on public.courses for all
  using (public.is_admin()) with check (public.is_admin());
create policy courses_instructor_insert on public.courses for insert
  with check (public.has_role('instructor') and is_digital_uni_original = true);

create policy course_categories_public_read on public.course_categories for select using (true);
create policy course_categories_admin_write on public.course_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Import/moderation queue: not public. Content managers + the importer only.
create policy course_sources_admin_read on public.course_sources for select
  using (public.is_admin() or imported_by = auth.uid());
create policy course_sources_admin_write on public.course_sources for all
  using (public.is_admin()) with check (public.is_admin());

create policy licenses_admin_only on public.licenses for all
  using (public.is_admin()) with check (public.is_admin());

create policy content_permissions_public_read on public.content_permissions for select using (true);
create policy content_permissions_admin_write on public.content_permissions for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Translation workflow: translators/reviewers see their assignments;
-- publication requires the same admin gate (Section 11: no auto-publish of
-- machine translations).
-- ---------------------------------------------------------------------------
create policy translations_read on public.translations for select
  using (
    status = 'approved_for_publication'
    or assigned_translator_id = auth.uid()
    or requested_by = auth.uid()
    or public.has_role('translator') or public.has_role('reviewer') or public.is_admin()
  );
create policy translations_translator_write on public.translations for update
  using (assigned_translator_id = auth.uid() or public.has_role('reviewer') or public.is_admin());
create policy translations_admin_insert on public.translations for insert
  with check (public.has_role('translator') or public.has_role('reviewer') or public.is_admin());

create policy subtitle_files_public_read on public.subtitle_files for select using (is_published = true);
create policy subtitle_files_team_read on public.subtitle_files for select
  using (public.has_role('translator') or public.has_role('reviewer') or public.is_admin());
create policy subtitle_files_admin_write on public.subtitle_files for all
  using (public.has_role('reviewer') or public.is_admin())
  with check (public.has_role('reviewer') or public.is_admin());

create policy translation_reviews_team on public.translation_reviews for all
  using (public.has_role('reviewer') or public.is_admin())
  with check (reviewer_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Pathways, enrollment, progress: learners manage their own enrollment/
-- progress rows only.
-- ---------------------------------------------------------------------------
create policy pathways_public_read on public.pathways for select
  using (publication_status = 'published' and deleted_at is null);
create policy pathways_admin_write on public.pathways for all
  using (public.is_admin()) with check (public.is_admin());

create policy pathway_courses_public_read on public.pathway_courses for select using (true);
create policy pathway_courses_admin_write on public.pathway_courses for all
  using (public.is_admin()) with check (public.is_admin());

create policy enrollments_own on public.enrollments for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy progress_own on public.progress for all
  using (
    exists (select 1 from public.enrollments e where e.id = enrollment_id and (e.user_id = auth.uid() or public.is_admin()))
  )
  with check (
    exists (select 1 from public.enrollments e where e.id = enrollment_id and (e.user_id = auth.uid() or public.is_admin()))
  );

create policy assessments_read on public.assessments for select using (true);
create policy assessments_write on public.assessments for all
  using (public.has_role('instructor') or public.is_admin())
  with check (public.has_role('instructor') or public.is_admin());

create policy questions_read on public.questions for select using (true);
create policy questions_write on public.questions for all
  using (public.has_role('instructor') or public.is_admin())
  with check (public.has_role('instructor') or public.is_admin());

create policy attempts_own on public.attempts for all
  using (user_id = auth.uid() or public.has_role('instructor') or public.is_admin())
  with check (user_id = auth.uid());

create policy projects_read on public.projects for select using (true);
create policy projects_write on public.projects for all
  using (public.has_role('instructor') or public.is_admin())
  with check (public.has_role('instructor') or public.is_admin());

create policy student_submissions_own on public.student_submissions for all
  using (user_id = auth.uid() or public.has_role('instructor') or public.is_admin())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Badges, credentials, verification: public verification is read-only and
-- deliberately excludes personal identifiers (application layer selects only
-- the safe columns — see credential-verification route).
-- ---------------------------------------------------------------------------
create policy badges_public_read on public.badges for select using (true);
create policy badges_admin_write on public.badges for all
  using (public.is_admin()) with check (public.is_admin());

create policy credentials_own_read on public.credentials for select
  using (user_id = auth.uid() or public.is_admin());
create policy credentials_admin_write on public.credentials for all
  using (public.is_admin()) with check (public.is_admin());

-- Public verification exposes only the columns Section 20 lists as safe —
-- no user_id, no join back to profiles/email. This view, not the base
-- table, is what the /verify/[credentialId] route queries.
-- security_invoker intentionally left at its default (off): the view runs
-- as its owner, which is how it can expose safe columns to anon/authenticated
-- even though the base-table policy below denies them direct row access.
create view public.credential_public_view as
  select
    protected_student_identifier,
    certificate_title,
    issuer,
    issue_date,
    expiration_date,
    credential_number,
    qr_code_url,
    program_status,
    authorization_status,
    is_revoked,
    external_issuer_url
  from public.credentials;

grant select on public.credential_public_view to anon, authenticated;

create policy credentials_public_verify_read on public.credentials for select
  using (false); -- base table never directly readable by the public; use the view above

create policy credential_verification_insert on public.credential_verification for insert with check (true);
create policy credential_verification_admin_read on public.credential_verification for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Accreditation / partnerships / CTE / FAA: public read of published
-- program status; only accreditation_administrator+ may write status.
-- ---------------------------------------------------------------------------
create policy accreditation_programs_public_read on public.accreditation_programs for select using (true);
create policy accreditation_programs_write on public.accreditation_programs for all
  using (public.has_role('accreditation_administrator') or public.has_role('super_administrator'))
  with check (public.has_role('accreditation_administrator') or public.has_role('super_administrator'));

create policy accreditation_evidence_admin_only on public.accreditation_evidence for all
  using (public.has_role('accreditation_administrator') or public.has_role('super_administrator'))
  with check (public.has_role('accreditation_administrator') or public.has_role('super_administrator'));

create policy partnership_proposals_admin_only on public.partnership_proposals for all
  using (public.has_role('accreditation_administrator') or public.has_role('super_administrator'))
  with check (public.has_role('accreditation_administrator') or public.has_role('super_administrator'));

create policy cte_programs_public_read on public.cte_programs for select using (true);
create policy cte_programs_write on public.cte_programs for all
  using (public.has_role('accreditation_administrator') or public.has_role('super_administrator'))
  with check (public.has_role('accreditation_administrator') or public.has_role('super_administrator'));

create policy faa_programs_public_read on public.faa_programs for select using (true);
create policy faa_programs_write on public.faa_programs for all
  using (public.has_role('accreditation_administrator') or public.has_role('super_administrator'))
  with check (public.has_role('accreditation_administrator') or public.has_role('super_administrator'));

-- ---------------------------------------------------------------------------
-- Governance: copyright requests + contact are write-only for the public
-- (anyone may submit; only compliance staff may read/manage). Audit log is
-- admin-read, system-insert only — no update/delete policy exists at all.
-- ---------------------------------------------------------------------------
create policy copyright_requests_public_insert on public.copyright_requests for insert with check (true);
create policy copyright_requests_admin_read on public.copyright_requests for select using (public.is_admin());
create policy copyright_requests_admin_update on public.copyright_requests for update using (public.is_admin());

create policy contact_submissions_public_insert on public.contact_submissions for insert with check (true);
create policy contact_submissions_admin_read on public.contact_submissions for select using (public.is_admin());

create policy audit_events_admin_read on public.audit_events for select using (public.is_admin());
create policy audit_events_system_insert on public.audit_events for insert with check (true);
