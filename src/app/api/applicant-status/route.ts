import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.OPENAI_API_KEY && process.env.APPLICANT_PLAN_SIGNING_SECRET) }, { headers: { 'Cache-Control': 'no-store' } });
}
