import { NextRequest, NextResponse } from 'next/server';
import { applicantReviewSchema } from '@/lib/applicant-planning';
import { verifyApplicantPlan } from '@/lib/applicant-plan-security';
import { createBrochurePdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`applicant-preview:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many preview requests. Please try again shortly.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = applicantReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'The brochure preview could not be created from this plan.' }, { status: 400 });
  }

  const signingSecret = process.env.APPLICANT_PLAN_SIGNING_SECRET;
  if (!signingSecret || !verifyApplicantPlan(parsed.data.answers, parsed.data.plan, parsed.data.planToken, signingSecret)) {
    return NextResponse.json({ error: 'This plan has changed. Please regenerate it before reviewing.' }, { status: 400 });
  }

  const generated = new Date().toISOString().slice(0, 10);
  const counselorReview = parsed.data.counselorReviewPreference === 'ai_counselor_preliminary'
    ? 'AI counselor preliminary recommendation followed by authorized human counselor review'
    : 'Authorized human counselor review';
  const pdf = createBrochurePdf(parsed.data.plan, 'REVIEW COPY - NOT SUBMITTED', generated, counselorReview);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'inline; filename="digital-uni-pathway-review.pdf"',
      'Content-Type': 'application/pdf'
    }
  });
}
