# Digital-UNI Site Birth Certificate and Operating Record

- **Project:** Digital-UNI
- **Founder:** Brahim Boumakh
- **Canonical public address:** https://www.digital-uni.net
- **Source repository:** https://github.com/bbbrahim250-lang/digital-uni
- **Deployment project:** `digital-uni` on Vercel
- **Recorded:** August 27, 2026
**Operational baseline:** GitHub `main` commit `385e9e1` (the remote equivalent of locally authorized commit `82c6f10`)

This is Digital-UNI's ceremonial site birth certificate and its technical operating record. It is intended to preserve project continuity, make recovery possible, and reduce dependence on screenshots or conversational memory. It is not a certificate of incorporation, accreditation, school authorization, land-use approval, or legal status.

## 1. Founding statement

Digital-UNI began as a multilingual education-platform codebase prepared with Claude and then developed through GitHub, Codex, Vercel, Supabase, OpenAI, and supporting infrastructure. The public site combines Industry 4.0 education pathways, professional AI programs, a Santa Monica AI-native private high-school proposal, AI Pioneers athletics, enrollment planning, and an AI-assisted candidate brochure workflow.

The durable record of the site is:

- Git history for every accepted source change.
- Vercel deployment history for every published build.
- Supabase migrations for the data model and access policies.
- This operating record for configuration, verification, recovery, and next actions.

Conversation history is useful context but is not the authoritative backup. Secrets must remain in Vercel or the appropriate provider and must never be copied into this document, screenshots, Git, or public PDFs.

## 2. Identity and architecture

| Layer | Current role | Authoritative location |
| --- | --- | --- |
| Domain | Public website and email identity | `digital-uni.net`, registered and DNS-managed through Turbify |
| Source control | Version history and rollback | GitHub repository `bbbrahim250-lang/digital-uni`, branch `main` |
| Web hosting | Next.js builds, deployments, environment variables, logs | Vercel project `digital-uni` |
| Application | Next.js 14 App Router, TypeScript, React, Tailwind | GitHub source tree |
| Languages | English, French, Arabic with RTL support | `/en`, `/fr`, `/ar` locale routes |
| Database and private files | Contact submissions, applicant plans, private brochures and resumes | Supabase with row-level security and private storage |
| AI planning | Candidate pathway proposal and personalized brochure content | Server-side OpenAI Responses API workflow |
| Email | Resend primary transport with authenticated SMTP fallback | Vercel secrets plus Resend/Turbify configuration |
| Robot verification | Campaign form abuse protection | Cloudflare Turnstile keys in Vercel |
| Payments | Provider-hosted checkout links | Vercel environment variables for approved providers |

## 3. Verified development timeline

The dates and commit subjects below come from the repository history. They are checkpoints, not a claim that every external service was fully configured on the same date.

| Date | Checkpoint | Evidence |
| --- | --- | --- |
| Aug. 23, 2026 | Production dependency foundation and first multilingual launch | `0806e34`, `f537314` |
| Aug. 23, 2026 | Animated AI Train, cinematic homepage, poster restoration, and responsive visual iterations | `8bf5959` through `d0a8b6a` and related merges |
| Aug. 24, 2026 | Cinematic AI Train pathways and homepage video integration | `bf5acdf`, `77757da`, `0c23c37` |
| Aug. 24, 2026 | Sound control, legal AI programs, payment-request flow, and enrollment improvements | `d521b4c`, `35dd203`, `c370161` |
| Aug. 24, 2026 | Secure multilingual applicant planning assistant and signed-plan protection | `393429f`, `6d1401b`, merged through PR #17 |
| Aug. 26, 2026 | Santa Monica AI High School campaign page, founder portrait, formal notice, investor deck, field story, AI Pioneers, and community form | `756056a` |
| Aug. 26, 2026 | Electronic signature, consent, City-copy authorization, and Turnstile enforcement | `6fbb331` |
| Aug. 27, 2026 | Vercel Resend integration-key support | `7437973` |
| Aug. 27, 2026 | Turbify authenticated SMTP fallback for campaign delivery | local `82c6f10`; GitHub `main` equivalent `385e9e1` |
| Aug. 27, 2026 | Enrollment/account delivery repair, resume upload, brochure attachments, and dual-inbox routing | Versioned with the implementation commit containing this record; use `git log -1 --oneline` after checkout |

## 4. Deployment and domain record

Verified from the Vercel and DNS configuration reviewed during setup:

- The Vercel project is named `digital-uni`.
- `www.digital-uni.net` is connected to Production.
- `digital-uni.net` redirects permanently to `www.digital-uni.net`.
- `digital-uni.vercel.app` is also connected to Production.
- Vercel reports the public domain configuration as valid.
- Turbify remains the third-party registrar/DNS manager.
- The DNS screen showed an apex A record and Vercel routing for the site, along with pre-existing mail-related records. Existing mail records must not be deleted merely to verify a new sender.

Resend integration record as of August 27, 2026:

- A Vercel-native Resend messaging resource was created and connected to the `digital-uni` project.
- Vercel provisions `RESEND_API_KEY`; the code also recognizes the older `EMAIL_SERVICE_API_KEY` name.
- The Resend DKIM TXT record at `resend._domainkey` was added in Turbify.
- The Resend SPF TXT record for the `send` subdomain was added in Turbify.
- Resend was still checking DNS propagation at the last verified screen.
- Turbify's MX editor did not provide a safe subdomain-host field. Its interface warned that adding low-priority MX records could redirect the domain's existing mail. Therefore, no destructive MX replacement was authorized.
- A Turbify Business Email SMTP fallback was implemented so form delivery does not depend solely on Resend domain verification.

## 5. Form and email delivery design

### Santa Monica AI High School campaign

The support form requires:

- Full name and matching typed electronic signature.
- Explicit signature, campaign-contact, City-copy, and legal acknowledgements.
- Cloudflare Turnstile robot verification.
- Email delivery to `enroll@digital-uni.net` and `financial_aid@digital-uni.net` with a copy to the Santa Monica City Council Office address configured in source.
- Private Supabase storage as a backup after email acceptance.

The form is a community-support registration. It is not a statutory initiative or ballot-petition signature.

### Enrollment and account requests

The standard enrollment, sign-in request, and sign-up request forms use the same shared delivery service. Requests are stored in Supabase and sent to:

- `enroll@digital-uni.net`
- `financial_aid@digital-uni.net`

The current sign-in and sign-up screens are account-access request forms. They do not yet create authentication credentials.

### AI applicant planning and brochure workflow

1. The candidate answers one question at a time in English, French, or Arabic.
2. The server sends only the necessary planning answers to OpenAI.
3. OpenAI returns a schema-validated proposed pathway, modules, schedule, applied project, tuition starting point, budget context, installment preference, and financial-aid inquiry status.
4. The server signs the proposal so browser-side edits cannot be submitted as an authentic generated plan.
5. The candidate reviews the plan, attaches a PDF or DOCX resume of no more than 3 MB, and gives explicit consent.
6. The server validates the file extension, media type, size, and file signature.
7. The server generates the personalized PDF brochure and stores the brochure and resume privately in Supabase.
8. One internal email, with both documents attached, is sent to both Digital-UNI inboxes. A confirmation and brochure copy is sent to the candidate.
9. The candidate receives a seven-day private brochure link and an application reference.

The tailored brochure is a proposal, not an enrollment acceptance, financial-aid approval, installment agreement, accreditation determination, or certification guarantee.

## 6. Environment-variable inventory

Only variable names belong in documentation. Values and passwords belong in encrypted Vercel configuration.

### Required platform and storage

```text
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### AI applicant planner

```text
OPENAI_API_KEY
OPENAI_MODEL
APPLICANT_PLAN_SIGNING_SECRET
```

### Email - primary and fallback

```text
RESEND_API_KEY
EMAIL_SERVICE_API_KEY
EMAIL_FROM_ADDRESS
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
```

For Turbify Business Email, the documented server settings used by the fallback are `smtp.bizmail.yahoo.com`, port `465`, and secure TLS. The mailbox password must be entered directly into Vercel and never shared in chat or Git.

### Robot verification and provider-hosted payments

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
STRIPE_CHECKOUT_URL
PAYPAL_CHECKOUT_URL
CRYPTO_CHECKOUT_URL
```

## 7. PowerShell recovery and verification runbook

These are repeatable recovery commands for a Windows PowerShell terminal. They are not a claim that every line was historically executed. Run them from a verified project folder and never paste secrets into the terminal transcript.

### Recreate a safe local working copy

```powershell
git clone https://github.com/bbbrahim250-lang/digital-uni.git
Set-Location .\digital-uni
git switch main
git pull --ff-only origin main
Copy-Item .env.example .env.local
npm ci
```

Fill `.env.local` locally with development-only values. Never commit it.

### Verify and optimize the production build

```powershell
npm run typecheck
npm test -- --run
npm run build
npm run dev
```

Open `http://localhost:3000/en`, `/fr`, and `/ar`. Verify the homepage, enrollment, sign-in request, sign-up request, AI High School page, document links, and mobile layout. A successful `next build` is the optimization checkpoint; do not delete source files to make a build pass.

### Inspect history before changing anything

```powershell
git status --short
git log -10 --oneline --decorate
git fetch origin
git log --oneline --left-right main...origin/main
```

### Create a reversible change

```powershell
git switch -c codex/describe-the-change
git add --all
git diff --cached
git commit -m "Describe the verified change"
```

Push only after the exact destination, branch, and commit are authorized.

### Recover from a bad published commit

Prefer a reversible Git commit or a Vercel deployment rollback. Do not use `git reset --hard` against the project.

```powershell
git switch main
git pull --ff-only origin main
git revert <bad-commit-sha>
npm ci
npm run typecheck
npm test -- --run
npm run build
git push origin main
```

In Vercel, a previous successful deployment can also be promoted while the Git fix is prepared. Record the promoted deployment and the later correcting commit in this document.

## 8. Data protection and recovery rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, email API keys, SMTP passwords, Turnstile secrets, or provider credentials.
- Never use a `NEXT_PUBLIC_` prefix for a secret.
- Keep the applicant brochure bucket private and use short-lived signed links.
- Retain applicant data only for the stated review period, currently up to 24 months unless law requires longer.
- Honor access and deletion requests received at `enroll@digital-uni.net`.
- Limit resume uploads to PDF or DOCX and 3 MB.
- Treat all candidate uploads as untrusted content; do not execute or automatically publish them.
- Use `git revert` and Vercel deployment history for recovery. Preserve unrelated user changes.
- Before changing DNS, record the exact current records and confirm the domain's active mail provider. Do not overwrite working mail routing to satisfy a sender-verification wizard.

## 9. Current verification checkpoint

At the time this record was prepared:

- TypeScript validation passed.
- All 12 automated tests passed.
- The full Next.js production build completed successfully for 84 generated pages/routes.
- English, French, and Arabic enrollment routes compiled.
- The campaign, enrollment, sign-in request, sign-up request, AI planner, PDF brochure generator, and submission APIs compiled.
- One older homepage image-optimization warning remained; it is unrelated to form delivery.
- Live email acceptance still depends on the correct Vercel email secrets and a new production deployment.
- A real end-to-end test must confirm receipt in both internal inboxes before the workflow is announced as operational.

## 10. Next actions

1. Add the Turbify SMTP values to the Vercel `digital-uni` project for Production and Preview, without revealing the password.
2. Confirm the Turnstile site and secret keys are present for the campaign page.
3. Authorize and push the enrollment/resume implementation commit recorded with this document.
4. Allow Vercel to deploy from GitHub `main` and confirm the deployment reports Ready.
5. Submit one clearly marked test campaign registration and verify both Digital-UNI inboxes plus the authorized City copy.
6. Submit one clearly marked test enrollment with a harmless sample PDF resume; verify the internal email reaches both inboxes with the resume and personalized brochure attached.
7. Confirm the applicant reference, database row, private storage objects, and seven-day brochure link.
8. Finish Resend domain verification only through DNS changes that do not disrupt existing Turbify mail.
9. Implement real Supabase sign-in/sign-up separately; until then, keep the pages labeled as account-access requests.
10. Configure approved payment-provider links and document installment terms before enabling any public payment promise.
11. Add retention cleanup, delivery monitoring, and a periodic recovery test.

## 11. Certificate affirmation

This record affirms that Digital-UNI's public website, source history, deployment path, multilingual structure, AI Train identity, Santa Monica AI High School campaign, AI Pioneers athletics, and secure applicant-planning foundation were assembled into a reproducible digital project under the direction of founder Brahim Boumakh.

The certificate is complete only when used with the repository history, Vercel deployment history, Supabase migrations, and securely stored service configuration.

| Certificate field | Recorded value |
| --- | --- |
| Record title | Digital-UNI Site Birth Certificate and Operating Record |
| Founder and project steward | Brahim Boumakh |
| Canonical public site | `www.digital-uni.net` |
| Source repository | `github.com/bbbrahim250-lang/digital-uni` |
| Hosting project | Vercel project `digital-uni` |
| Remote recovery baseline | GitHub `main` commit `385e9e1` |
| Enrollment implementation | The commit containing this record; run `git log -1 --oneline` |
| Verification standard | TypeScript, automated tests, production build, route checks, live delivery test |
| Record date | August 27, 2026 |

**Founder acknowledgment:** This record is prepared for review and acceptance by Brahim Boumakh as the continuing technical history of Digital-UNI.

**Acknowledged by:** ____________________________________

**Date:** ______________________________________________

**Recorded for Digital-UNI on August 27, 2026.**
