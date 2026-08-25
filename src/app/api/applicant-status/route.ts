import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.OPENAI_API_KEY) }, { headers: { 'Cache-Control': 'no-store' } });
}
