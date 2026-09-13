# Digital-UNI AI Train — PRD

## Product
An illustrative/demo mobile-first Expo app that acts as the narrative front door to the Digital-UNI ecosystem: AI-native education, professional certification, application development & commercialization, research, physical AI high schools, athletics, and community.

Tagline: "Moving at the speed of learning."
Institutional statement: "DIGITAL-UNI — University of the Future. Jobs of Tomorrow. LEAD WITH AI. Board the AI Train →"

## Journey (implemented)
DISCOVER → BOARD (pick a Track) → LEARN (Track's Stations) → CERTIFY (Boarding-Pass Ticket + Credentials) → BUILD (AI Lab pipeline showcase) → COMMERCIALIZE (75/25 model) → EXPAND (Discover + Take Action).

## Screens implemented
Home, Track detail, Enroll, Ticket (boarding pass), Certify (4 credentials), Legal AI (Judge/Lawyer/Clerk), Store (exploratory + concert/event tickets + fundraising chips + apparel + tryout promo), Checkout (4 payment methods + disabled PayPal), Order Confirmed (receipt), Tryout (form + docs + $45 fee) + Tryout Confirmation, Sample Course (video preview + quiz + AI grading spinner + fail/badge), AI Lab (6-stage pipeline + flagship apps), Commercialization (75/25), Discover (5 ecosystem cards), Take Action (5 CTAs), Sign In (9-role picker + tab bar + founder card + fundraising CTAs), Sign Up (7-role picker), Confirmations.

## Backend endpoints (illustrative persistence)
- POST /api/enrollments — issues DU-AIT-XXXX ticket
- POST /api/orders — issues DU-ORD-XXXX
- POST /api/tryouts — issues DU-TRY-{SPORT}-XXXX, fee=$45
- POST /api/badges — issues DU-BADGE-{COURSE}-XXXX, computes percent
- GET list endpoints for enrollments/orders

## Design
Dark, premium/futuristic. Colors from `/app/design_guidelines.json` (bg #0a0e1f, panel #10162c, brand #34e08a, gold #f2a93c). Reusable boarding-pass Ticket component with dark-green header, cream body, dashed perforation with punch holes, QR block, green footer bar, and optional Bitcoin-equivalent gold badge on ticket-issuance moments only (per V46 pullback).

## Disclaimers (baked into copy)
Every commerce/auth/upload/grading screen shows an illustrative-demo chip. Preserved verbatim from the blueprint.

## Known limitations (demo)
- No real payments (PayPal button intentionally disabled placeholder).
- No real auth/uploads (all forms are client-side toggles).
- Course quiz is graded locally by simulated multi-step spinner.
- Legal AI personas are static fictional composites.
