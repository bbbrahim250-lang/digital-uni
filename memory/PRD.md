# Digital-UNI AI Train — PRD

## Product
An illustrative/demo mobile-first Expo app that acts as the narrative front door to the Digital-UNI ecosystem: AI-native education, professional certification, application development & commercialization, research, physical AI high schools, athletics, and community.

Tagline: "Moving at the speed of learning."
Institutional statement: "DIGITAL-UNI — University of the Future. Jobs of Tomorrow. LEAD WITH AI. Board the AI Train →"

## Journey (implemented)
DISCOVER → BOARD (pick a Track) → LEARN (Track's Stations) → CERTIFY (Boarding-Pass Ticket + Credentials) → BUILD (AI Lab pipeline showcase) → COMMERCIALIZE (75/25 model) → EXPAND (Discover + Take Action).

## Screens implemented
Home, Track detail, Enroll, Ticket (boarding pass), Certify (4 credentials), Legal AI (Judge/Lawyer/Clerk), Store (exploratory + concert/event tickets + fundraising chips w/ Donate/Pledge toggle + apparel + tryout promo), Checkout, Order Confirmed, Tryout + Tryout Confirmation, Sample Course + AI grading + Fail/Badge, AI Lab, Commercialization (75/25), Discover, Take Action, Sign In (9-role picker + tab bar + founder card), Sign Up (7-role picker), Confirmations.

**New (Section 14 — Community Signature & Pledge Campaign):**
- **Home** — 2 new buttons: "100,000 · Join Community" and "City Council Letter · PDF"
- **Community Signature screen** — per-community (Santa Monica-Malibu / Palo Alto-Redwood City / Paris 8) form with full name, email, phone, ZIP, connection dropdown, area-of-interest dropdown, comment, electronic signature, 4 required consent checkboxes, live counter (X of 100,000) fed by real backend
- **Community Confirmation** — issues DU-SIG-{COMMUNITY}-{TIMESTAMP} + PDF support-letter download
- **Store Fundraising extension** — Donate Now / Pledge Instead toggle above each of the two boarding-pass fundraising cards
- **Pledge screen** — fund picker (AI Lab Research / AI High Schools), community picker, name/email, 5 tier buttons ($100–$1M) with real backend persistence
- **Pledge Confirmation** — issues DU-CERT-{COMMUNITY}-{TIMESTAMP} + PDF certificate download

## Backend endpoints
- POST /api/enrollments — issues DU-AIT-XXXX ticket
- POST /api/orders — issues DU-ORD-XXXX
- POST /api/tryouts — issues DU-TRY-{SPORT}-XXXX, fee=$45
- POST /api/badges — issues DU-BADGE-{COURSE}-XXXX
- **POST /api/signatures — issues DU-SIG-{COMMUNITY_UPPER}-{TIMESTAMP} (Section 14, REAL persistence not demo state)**
- **GET /api/signatures/count?community={id} — live counter for the 100,000 campaign**
- **POST /api/pledges — issues DU-CERT-{COMMUNITY_UPPER}-{TIMESTAMP} (Section 14, REAL persistence)**
- GET /health — deployment health probe
- GET /api/media/* — serves hero-train.mp4 (1280x538) and course-video.mp4 (560x374)

## PDF generation (Section 14.5)
- `expo-print` + `expo-sharing` for cross-platform PDF export
- Web: `window.print()` on rendered HTML (user chooses "Save as PDF")
- Native: `Print.printToFileAsync` + `Sharing.shareAsync`
- Two templates: `letterHTML()` (formal city-council letter with signer's fields), `certificateHTML()` (community impact certificate with crest, name, tier, disclaimer)
- Static "council letter template" shipped for the Home's "City Council Letter · PDF" button

## Design
Dark, premium/futuristic. Colors from `/app/design_guidelines.json` (bg #0a0e1f, panel #10162c, brand #34e08a, gold #f2a93c). Boarding-pass Ticket component (Home enrollment/tryout confirmations), Store BoardingPassCard (event/fundraising catalog), Community/Pledge receipt cards with hexagonal-shield crest per community.

## Disclaimers baked in
Every commerce/auth/upload/grading screen shows an illustrative-demo chip. CAMPAIGN_DISCLAIMER ("This declaration of support reflects Digital-UNI's community-building campaign only. It is submitted independently of, and is not to be construed as, an endorsement or vote related to any candidacy, including the founder's candidacy for Santa Monica College Board.") shown on the Community Signature screen, in submission confirmations, and on generated PDFs.

## Known limitations (demo)
- No real payments (PayPal button intentionally disabled placeholder). Pledges are commitment-only, no payment processed.
- No real auth (Sign In/Sign Up forms are illustrative-only). Community Signatures & Pledges DO persist to real backend for genuine count/export.
- Course quiz graded locally by simulated multi-step spinner.
- Legal AI personas are static fictional composites.
- No real email dispatch — "Email Digital-UNI and the City Council Office" copy present but not wired to a mail service.
