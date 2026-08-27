import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { brochureDisclaimer, submissionSchema } from '@/lib/applicant-planning';
import { createBrochurePdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';
import { verifyApplicantPlan } from '@/lib/applicant-plan-security';
import { validateApplicantResume } from '@/lib/applicant-files';
import { sendTransactionalEmail } from '@/lib/email';

export const runtime = 'nodejs';

const INTERNAL_ENROLLMENT_RECIPIENTS = ['enroll@digital-uni.net', 'financial_aid@digital-uni.net'];

function parseJsonField(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`submit:${ip}`, 3, 10 * 60_000)) return NextResponse.json({ error: 'Too many submissions. Please try later.' }, { status: 429 });
  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'The application form could not be read.' }, { status: 400 });
  const parsed = submissionSchema.safeParse({
    answers: parseJsonField(formData, 'answers'),
    plan: parseJsonField(formData, 'plan'),
    planToken: formData.get('planToken'),
    consent: formData.get('consent') === 'true',
    website: formData.get('website')
  });
  if (!parsed.success) return NextResponse.json({ error: 'Explicit consent and a valid plan are required.' }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: 'Submission rejected.' }, { status: 400 });
  const resumeFile = formData.get('resume');
  if (!(resumeFile instanceof File)) return NextResponse.json({ error: 'Please attach your résumé as a PDF or DOCX file.' }, { status: 400 });
  let resume;
  try {
    resume = validateApplicantResume({
      filename: resumeFile.name,
      contentType: resumeFile.type || 'application/octet-stream',
      content: Buffer.from(await resumeFile.arrayBuffer())
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'The résumé could not be validated.' }, { status: 400 });
  }
  const signingSecret = process.env.APPLICANT_PLAN_SIGNING_SECRET;
  if (!signingSecret || !verifyApplicantPlan(parsed.data.answers, parsed.data.plan, parsed.data.planToken, signingSecret)) {
    return NextResponse.json({ error: 'This plan is invalid or has been changed. Please regenerate it before submitting.' }, { status: 400 });
  }
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
  if (!url || !key) return NextResponse.json({ error: 'Secure application storage is not configured. Please use the email links below.' }, { status: 503 });

  const reference = `DU-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const generated = new Date().toISOString().slice(0, 10);
  const brochurePath = `${reference}/personalized-pathway.pdf`;
  const resumePath = `${reference}/resume.${resume.extension}`;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const pdf = createBrochurePdf(parsed.data.plan, reference, generated);
  const brochureUpload = await supabase.storage.from('applicant-brochures').upload(brochurePath, pdf, { contentType: 'application/pdf', upsert: false });
  if (brochureUpload.error) return NextResponse.json({ error: 'Brochure storage failed. Nothing was submitted.' }, { status: 502 });
  const resumeUpload = await supabase.storage.from('applicant-brochures').upload(resumePath, resume.content, { contentType: resume.contentType, upsert: false });
  if (resumeUpload.error) {
    await supabase.storage.from('applicant-brochures').remove([brochurePath]);
    return NextResponse.json({ error: 'Résumé storage failed. Nothing was submitted.' }, { status: 502 });
  }
  const stored = await supabase.from('applicant_plans').insert({ reference, applicant_name: parsed.data.answers.name, applicant_email: parsed.data.answers.email, preferred_language: parsed.data.answers.preferredLanguage, financial_aid_requested: parsed.data.answers.financialAid, installment_preference: parsed.data.answers.installmentPreference, plan: { ...parsed.data.plan, resumePath, resumeFilename: resume.filename }, brochure_path: brochurePath, consented_at: new Date().toISOString(), status: 'notification_pending' });
  if (stored.error) {
    await supabase.storage.from('applicant-brochures').remove([brochurePath, resumePath]);
    return NextResponse.json({ error: 'Application storage failed. Nothing was submitted.' }, { status: 502 });
  }
  const signed = await supabase.storage.from('applicant-brochures').createSignedUrl(brochurePath, 60 * 60 * 24 * 7);
  if (signed.error) return NextResponse.json({ error: 'A secure brochure link could not be created.' }, { status: 502 });
  const summary = [`Application: ${reference}`, `Applicant: ${parsed.data.answers.name} <${parsed.data.answers.email}>`, `Program: ${parsed.data.plan.recommendedProgram}`, `Financial-aid information requested: ${parsed.data.answers.financialAid ? 'Yes' : 'No'}`, `Installment preference (request only): ${parsed.data.answers.installmentPreference}`, `Résumé attached: ${resume.filename}`, `Secure brochure (expires in 7 days): ${signed.data.signedUrl}`, '', brochureDisclaimer].join('\n');
  const [internalDelivery, applicantDelivery] = await Promise.all([
    sendTransactionalEmail({
      to: INTERNAL_ENROLLMENT_RECIPIENTS,
      replyTo: parsed.data.answers.email,
      subject: `Digital-UNI application ${reference}`,
      text: `${summary}\n\nThe candidate résumé and personalized Digital-UNI brochure are attached.`,
      attachments: [
        { filename: resume.filename, content: resume.content, contentType: resume.contentType },
        { filename: `${reference}-personalized-brochure.pdf`, content: pdf, contentType: 'application/pdf' }
      ],
      idempotencyKey: `digital-uni-application/${reference}/internal`,
      messageId: `<application-${reference.toLowerCase()}@digital-uni.net>`
    }),
    sendTransactionalEmail({
      to: [parsed.data.answers.email],
      replyTo: 'enroll@digital-uni.net',
      subject: `Your Digital-UNI proposal ${reference}`,
      text: `Thank you for reviewing and approving your proposed pathway.\n\n${summary}`,
      attachments: [
        { filename: `${reference}-personalized-brochure.pdf`, content: pdf, contentType: 'application/pdf' }
      ],
      idempotencyKey: `digital-uni-application/${reference}/applicant`,
      messageId: `<applicant-copy-${reference.toLowerCase()}@digital-uni.net>`
    })
  ]);
  const accepted = internalDelivery.accepted && applicantDelivery.accepted;
  if (!accepted) return NextResponse.json({ error: 'Your application was stored, but the email provider did not accept every notification. Please contact enroll@digital-uni.net and quote your reference.', reference }, { status: 502 });
  await supabase.from('applicant_plans').update({ status: 'notified' }).eq('reference', reference);
  console.info('Applicant workflow notification accepted', { reference, financialAid: parsed.data.answers.financialAid });
  return NextResponse.json({ submitted: true, reference, brochureUrl: signed.data.signedUrl });
}
