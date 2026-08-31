import { NextRequest, NextResponse } from 'next/server';
import {
  campaignConnectionValues,
  campaignInterestValues,
  campaignSupportSchema
} from '@/lib/schemas';
import { createCommunitySupportLetterPdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const connectionLabels: Record<(typeof campaignConnectionValues)[number], string> = {
  resident: 'Santa Monica resident',
  parent_guardian: 'Parent or guardian',
  student: 'Student',
  educator: 'Educator',
  business_community: 'Business or community organization',
  other: 'Other supporter'
};

const interestLabels: Record<(typeof campaignInterestValues)[number], string> = {
  private_ai_high_school: 'AI-native private high school',
  ai_pioneers_athletics: 'AI Pioneers Sharks athletics and field',
  technology_workforce: 'AI labs, compute, and workforce programs',
  investment_partnership: 'Investment or strategic partnership',
  volunteer: 'Volunteer or community outreach',
  general_support: 'General community support'
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`community-support-preview:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many letter previews. Please try again shortly.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = campaignSupportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Complete the required fields before reviewing the letter.' }, { status: 400 });
  }

  const logoResponse = await fetch(
    new URL('/images/digital-uni-ai-pioneers-sharks-santa-monica-letterhead.jpg', request.nextUrl.origin),
    { cache: 'force-cache' }
  );
  if (!logoResponse.ok) {
    return NextResponse.json({ error: 'The AI Pioneers Sharks letterhead is temporarily unavailable.' }, { status: 503 });
  }

  const logo = Buffer.from(await logoResponse.arrayBuffer());
  const reference = `DU-SM-${parsed.data.submissionId.slice(0, 8).toUpperCase()}`;
  const pdf = createCommunitySupportLetterPdf({
    generated: new Date().toISOString().slice(0, 10),
    reference,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    zipCode: parsed.data.zipCode,
    connection: connectionLabels[parsed.data.connection],
    interest: interestLabels[parsed.data.interest],
    message: parsed.data.message,
    signatureName: parsed.data.signatureName
  }, logo, { width: 240, height: 300 });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'attachment; filename="digital-uni-santa-monica-support-review.pdf"',
      'Content-Type': 'application/pdf'
    }
  });
}
