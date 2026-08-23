# Digital-UNI — Build Progress

## Milestone 1 — Project Foundation, Design System, Localization, Homepage (in progress)

**Built this session** (hand-written source, not yet `npm install`'d or built —
see "Known limitation" below):

- `package.json`, `tsconfig.json` (strict), `next.config.js`, `tailwind.config.ts`
- Design tokens: navy/gold/turquoise/electric-blue palette, focus-visible
  outlines, reduced-motion support (`src/styles/globals.css`,
  `tailwind.config.ts`)
- Locale routing: `src/middleware.ts` + `src/i18n/*` (en/ar/fr), `[locale]`
  segment, `lang`/`dir` set per request, RTL font swap for Arabic
- Message dictionaries: `messages/en.json`, `messages/fr.json`,
  `messages/ar.json` — nav, hero, categories, legal/attribution notices,
  footer, a11y strings
- Layout: `SiteHeader` (nav + language switcher + sign in/up), `SiteFooter`
  (attribution notice, no-accreditation-claim notice, legal links)
- Homepage: Hero, FeaturedCategories, LegalNotice sections
- Reusable UI primitives started: `Card`, `Badge`
- `.env.example` with all required placeholder keys, no real credentials

**Not yet built (rest of Milestone 1):**
- Featured-courses, pathways, multilingual, cert-prep, FAA, CTE, and
  accreditation-roadmap homepage sections (need seed data — pulled forward
  from Milestone 2)
- Empty-state / error-state / loading-state / dialog / table components
- Remaining public route stubs (courses, pathways, institutions, etc.)

## Session 2 additions — Supabase schema + remaining public routes

**Database (`supabase/migrations/0001`–`0006`, `supabase/seed/0001`):**
- Full Section 22 table set (users/profiles/roles through audit_events),
  UUID PKs, timestamps, soft deletes where listed, `authorization_status`/
  `publication_status`/`translation_status`/`program_status` enums matching
  Sections 4, 11, 16, 18.
- RLS enabled on every table (`0006_row_level_security.sql`): public read
  is limited to `published`/non-deleted rows; writes to
  authorization/accreditation/CTE/FAA status fields are gated to
  `content_manager`+ or `accreditation_administrator`+ via a `has_role()`/
  `is_admin()` helper — enforcing "only authorized administrators may
  assign approval, partnership, accreditation, or credit-bearing status"
  at the database layer, not just in the UI.
- Credential verification (Section 20) exposes only a `credential_public_view`
  (no `user_id`, no email) — the base `credentials` table has no public
  select policy at all, so a UI bug can't leak personal data.
- Demonstration seed started (`0001_demo_institutions_categories.sql`):
  5 institutions, 12 categories, all `is_demonstration = true`. **Not**
  seeded yet: courses, pathways, FAA/CTE program rows, and the
  Oracle/Claude-ecommerce/IBM/Apple cert-prep examples Section 23
  requires — deferred so they're built from real course-authoring flows in
  Milestone 2 rather than hand-typed placeholder facts.

**Routes (Section 7):** every listed public route now exists —
`courses`, `courses/[slug]`, `pathways`, `pathways/[slug]`, `institutions`,
`institutions/[slug]`, `certifications`, `accreditation` (roadmap +
disclaimer), `faa-ai-controller` (full curriculum list + mandatory
disclaimer), `cte` (with the Digital-UNI-vs-state-approved distinction),
`translations`, `about`, `partnerships`, `copyright`, `copyright-removal`
(working Zod + React Hook Form + server action writing to
`copyright_requests`), `privacy`, `terms`, `accessibility`, `contact`
(same pattern, writes to `contact_submissions`), `verify/[credentialId]`
(queries `credential_public_view` only).

**Still missing:** authenticated routes (sign-in/up, student dashboard,
instructor portal, translator/reviewer workspace, admin dashboard) —
these need real Supabase Auth wiring and are a good Milestone 2/3 unit on
their own. List/search/filter UI for courses/pathways/institutions still
renders nothing dynamic (detail pages query real tables; index pages are
still the static placeholder from Milestone 1).

## Known limitation (this environment)

This session ran in a sandbox with **network access disabled**, so I could
not run `npm install`, start a Supabase project, or run
lint/typecheck/test/build as Section 26/27 require after each milestone.
Everything above is hand-written, believed-correct TypeScript/JSON, but
**unverified by an actual build**.

Recommended next step: open this folder in **Claude Code** (or any
environment with npm + network access) and run:

```
npm install
npm run typecheck
npm run lint
npm run build
```

Fix whatever surfaces, then continue with Milestone 2 (database schema +
migrations, Supabase auth, course catalog, search/filters, seed data) as
specified in the master prompt.

## Decisions made without asking (per "ask only when a missing decision
makes implementation impossible")

- `localePrefix: 'always'` — every route always has an explicit `/en`,
  `/ar`, or `/fr` prefix, including default locale, for unambiguous SEO
  and locale-switching.
- Language preference persistence deferred to next-intl's own
  cookie/URL mechanism rather than a custom user-preference table (that
  belongs with the student dashboard in Milestone 3).
- Fonts: Inter (Latin) / Noto Sans Arabic (Arabic) as placeholders —
  swap for licensed brand fonts when available.
