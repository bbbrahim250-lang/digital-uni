import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { brochureDisclaimer, submissionSchema } from '@/lib/applicant-planning';
import { createBrochurePdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';
import { verifyApplicantPlan } from '@/lib/applicant-plan-security';

export const runtime = 'nodejs';

async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.EMAIL_SERVICE_API_KEY || !process.env.EMAIL_FROM_ADDRESS) return false;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.EMAIL_FROM_ADDRESS, to: [to], subject, text }) });
  if (!response.ok) return false;
  return Boolean(((await response.json()) as { id?: string }).id);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`submit:${ip}`, 3, 10 * 60_000)) return NextResponse.json({ error: 'Too many submissions. Please try later.' }, { status: 429 });
  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Explicit consent and a valid plan are required.' }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: 'Submission rejected.' }, { status: 400 });
  const signingSecret = process.env.APPLICANT_PLAN_SIGNING_SECRET;
  if (!signingSecret || !verifyApplicantPlan(parsed.data.answers, parsed.data.plan, parsed.data.planToken, signingSecret)) {
    return NextResponse.json({ error: 'This plan is invalid or has been changed. Please regenerate it before submitting.' }, { status: 400 });
  }
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
  if (!url || !key) return NextResponse.json({ error: 'Secure application storage is not configured. Please use the email links below.' }, { status: 503 });

  const reference = `DU-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const generated = new Date().toISOString().slice(0, 10);
  const path = `${reference}/personalized-pathway.pdf`;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const pdf = createBrochurePdf(parsed.data.plan, reference, generated);
  const upload = await supabase.storage.from('applicant-brochures').upload(path, pdf, { contentType: 'application/pdf', upsert: false });
  if (upload.error) return NextResponse.json({ error: 'Brochure storage failed. Nothing was submitted.' }, { status: 502 });
  const stored = await supabase.from('applicant_plans').insert({ reference, applicant_name: parsed.data.answers.name, applicant_email: parsed.data.answers.email, preferred_language: parsed.data.answers.preferredLanguage, financial_aid_requested: parsed.data.answers.financialAid, installment_preference: parsed.data.answers.installmentPreference, plan: parsed.data.plan, brochure_path: path, consented_at: new Date().toISOString(), status: 'notification_pending' });
  if (stored.error) { await supabase.storage.from('applicant-brochures').remove([path]); return NextResponse.json({ error: 'Application storage failed. Nothing was submitted.' }, { status: 502 }); }
  const signed = await supabase.storage.from('applicant-brochures').createSignedUrl(path, 60 * 60 * 24 * 7);
  if (signed.error) return NextResponse.json({ error: 'A secure brochure link could not be created.' }, { status: 502 });
  const summary = [`Application: ${reference}`, `Applicant: ${parsed.data.answers.name} <${parsed.data.answers.email}>`, `Program: ${parsed.data.plan.recommendedProgram}`, `Financial-aid information requested: ${parsed.data.answers.financialAid ? 'Yes' : 'No'}`, `Installment preference (request only): ${parsed.data.answers.installmentPreference}`, `Secure brochure (expires in 7 days): ${signed.data.signedUrl}`, '', brochureDisclaimer].join('\n');
  const deliveries = [sendEmail('enroll@digital-uni.net', `Digital-UNI application ${reference}`, summary), sendEmail(parsed.data.answers.email, `Your Digital-UNI proposal ${reference}`, `Thank you for reviewing and approving your proposed pathway.\n\n${summary}`)];
  if (parsed.data.answers.financialAid) deliveries.push(sendEmail('financial_aid@digital-uni.net', `Financial-aid information request ${reference}`, summary));
  const accepted = (await Promise.all(deliveries)).every(Boolean);
  if (!accepted) return NextResponse.json({ error: 'Your application was stored, but the email provider did not accept every notification. Please contact enroll@digital-uni.net and quote your reference.', reference }, { status: 502 });
  await supabase.from('applicant_plans').update({ status: 'notified' }).eq('reference', reference);
  console.info('Applicant workflow notification accepted', { reference, financialAid: parsed.data.answers.financialAid });
  return NextResponse.json({ submitted: true, reference, brochureUrl: signed.data.signedUrl });
}
