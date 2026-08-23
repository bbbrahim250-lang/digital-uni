# Digital-UNI — From Repo to Alpha on www.digital-uni.net

This is a walkthrough, not something I can execute for you — it needs your
GitHub, Supabase, hosting, and domain-registrar accounts, none of which I
have access to. Follow it in order; each step tells you what to click/type
and what "done" looks like.

---

## Part A — Create the repository ("depositary")

1. **Create an empty GitHub (or GitLab) repository** named `digital-uni`.
   Don't initialize it with a README — you already have one.
2. **Unzip** the project archive I gave you into a local folder.
3. From inside that folder:
   ```bash
   git init
   git add .
   git commit -m "Milestone 1: foundation, i18n, homepage, schema, public routes"
   git branch -M main
   git remote add origin https://github.com/<your-username>/digital-uni.git
   git push -u origin main
   ```
4. Add a `.gitignore` if you don't have one yet:
   ```
   node_modules/
   .next/
   .env.local
   .env
   ```
   (Never commit `.env` — only `.env.example` should be in the repo.)

**Done looks like:** the file tree from `PROGRESS.md` visible on GitHub.

---

## Part B — Stand up Supabase (database + auth)

1. Go to supabase.com → **New project**. Pick a region close to your
   expected users (e.g. a US or EU region).
2. Note down, from **Project Settings → API**:
   - Project URL → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this one
     server-side only, never in client code or NEXT_PUBLIC_ vars)
3. **Run the migrations.** Easiest path — Supabase CLI:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   This applies `supabase/migrations/0001` through `0006` in order —
   tables, enums, and every RLS policy in `PROGRESS.md`.
4. **Run the seed file** (demonstration institutions/categories):
   ```bash
   supabase db execute -f supabase/seed/0001_demo_institutions_categories.sql
   ```
5. **Sanity check in the Supabase Table Editor:** open `institutions` —
   you should see 5 rows, all `is_demonstration = true`. Open
   **Authentication → Policies** and confirm RLS shows as "Enabled" on
   `courses`, `credentials`, `roles`, etc.
6. **Give yourself the super_administrator role** (needed to manage
   content later): sign up once through the app (once deployed) or via
   Supabase Auth directly, then in the SQL editor:
   ```sql
   insert into public.users (id, email) values ('<your-auth-uid>', '<your-email>');
   insert into public.roles (user_id, role) values ('<your-auth-uid>', 'super_administrator');
   ```

**Done looks like:** `supabase db push` reports 6 migrations applied, no
errors; the seed rows are visible in the Table Editor.

---

## Part C — Configure environment variables

Copy `.env.example` to `.env.local` for local testing, and fill in what
you have so far:

```
NEXT_PUBLIC_BASE_URL=https://www.digital-uni.net
NEXT_PUBLIC_SUPABASE_URL=<from Part B>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Part B>
SUPABASE_SERVICE_ROLE_KEY=<from Part B>
```

Leave `YOUTUBE_DATA_API_KEY`, `TRANSLATION_PROVIDER_API_KEY`,
`EMAIL_SERVICE_API_KEY` blank for the alpha — nothing built so far calls
them yet.

**Locally test it builds before deploying:**
```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev   # visit http://localhost:3000/en, /ar, /fr
```
Fix anything that fails here — this is the step the earlier sandbox
couldn't run, so it's the first real checkpoint.

---

## Part D — Deploy (Vercel is the fastest path for Next.js)

1. Go to vercel.com → **Add New Project** → import the `digital-uni`
   GitHub repo.
2. Framework preset: Vercel auto-detects Next.js — leave defaults.
3. **Environment Variables** screen: paste in the same three
   `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` values, plus
   `NEXT_PUBLIC_BASE_URL=https://www.digital-uni.net`. Add for all
   environments (Production, Preview, Development).
4. Click **Deploy**. Vercel gives you a temporary URL like
   `digital-uni.vercel.app` — open it and confirm `/en`, `/ar` (check
   RTL), and `/fr` all render, and the language switcher works.

**Done looks like:** the temporary `.vercel.app` URL shows the homepage
correctly in all three locales.

---

## Part E — Point digital-uni.net at it

1. In the Vercel project → **Settings → Domains**, add:
   - `www.digital-uni.net` (primary — matches `NEXT_PUBLIC_BASE_URL` and
     the canonical URL already set in `next.config.js`/metadata)
   - `digital-uni.net` (apex — Vercel will mark it "redirects to www",
     which matches the redirect already coded in `next.config.js`)
2. Vercel shows you the DNS records to add. Go to wherever
   `digital-uni.net` is registered (your registrar's DNS panel) and add
   what Vercel shows — typically:
   - `A` record for the apex (`@`) → Vercel's IP (Vercel displays the
     current value)
   - `CNAME` for `www` → `cname.vercel-dns.com`
3. DNS propagation takes anywhere from a few minutes to ~48 hours.
   Vercel's Domains page shows a green checkmark once it's verified and
   the SSL certificate is issued automatically.

**Done looks like:** `https://www.digital-uni.net` loads the same site
as the `.vercel.app` URL, with a valid padlock/SSL.

---

## Part F — Alpha-readiness checklist before you share the link

Straight from Section 28's acceptance criteria, scoped to what Milestone 1
actually built:

- [ ] Build succeeds (`npm run build`) with no errors
- [ ] `/en`, `/ar`, `/fr` all render; Arabic is right-to-left
- [ ] Language switcher persists the choice across navigation
- [ ] Every page shows the attribution/no-accreditation-claim notices in
      the footer — check this in all three languages
- [ ] `contact` and `copyright-removal` forms actually submit (check the
      Supabase Table Editor for a new row after testing each)
- [ ] `verify/[credentialId]` shows "not found" gracefully for a random
      ID (there's no real credential yet, so this is expected — just
      confirm it doesn't crash)
- [ ] No page claims accreditation, FAA approval, or a named-company
      partnership — the FAA and CTE pages show their disclaimers
      prominently
- [ ] Add a visible "Alpha" or "Demonstration" banner somewhere
      persistent (header or homepage) — nothing in the current build
      says this is a work-in-progress yet; that's worth adding before
      sharing the link publicly, given Section 23's labeling
      requirement for demonstration content

## What alpha will still be missing

No sign-in/sign-up, no student/instructor/admin dashboards, no working
course search — only two static category cards and detail pages that
`404` until you add course rows by hand in Supabase. That's expected for
an alpha built through Milestone 1 plus schema; Milestone 2 (auth +
catalog + seed data) is what turns this into something a test user can
actually click around in.
