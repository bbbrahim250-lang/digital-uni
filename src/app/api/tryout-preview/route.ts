import { NextRequest, NextResponse } from 'next/server';
import { createTryoutApplicationPdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';
import { tryoutApplicationSchema } from '@/lib/tryout';
import { signTryoutApplication } from '@/lib/tryout-security';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`tryout-preview:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many tryout previews. Please try again shortly.' }, { status: 429 });
  }
  const parsed = tryoutApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Complete the required tryout fields before reviewing the brochure.' }, { status: 400 });
  }
  const secret = process.env.APPLICANT_PLAN_SIGNING_SECRET;
  if (!secret) return NextResponse.json({ error: 'Secure tryout review is not configured.' }, { status: 503 });

  const reference = `DU-TRY-${new Date().getUTCFullYear()}-${parsed.data.submissionId.slice(0, 8).toUpperCase()}`;
  const pdf = createTryoutApplicationPdf(parsed.data, reference, new Date().toISOString().slice(0, 10));
  const reviewToken = signTryoutApplication(parsed.data, secret);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `inline; filename="${reference}-review.pdf"`,
      'Content-Type': 'application/pdf',
      'X-Tryout-Application-Id': reference,
      'X-Tryout-Review-Token': reviewToken
    }
  });
}
