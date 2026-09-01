import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/email';
import { createTryoutApplicationPdf } from '@/lib/pdf';
import { rateLimit } from '@/lib/rate-limit';
import {
  reviewedTryoutApplicationSchema,
  tryoutApplicationSchema,
  tryoutCampusLabels,
  tryoutDisclaimer,
  tryoutSessionLabels,
  tryoutSportLabels
} from '@/lib/tryout';
import { validateTryoutEvidence } from '@/lib/tryout-files';
import { verifyTryoutApplication } from '@/lib/tryout-security';

export const runtime = 'nodejs';

function parseApplication(formData: FormData) {
  const value = formData.get('application');
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`tryout-submit:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many tryout submissions. Please try again later.' }, { status: 429 });
  }
  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'The tryout application could not be read.' }, { status: 400 });
  const parsed = reviewedTryoutApplicationSchema.safeParse({
    ...(parseApplication(formData) as object | null),
    reviewed: formData.get('reviewed') === 'true'
  });
  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ error: 'Review the complete tryout brochure and accept all required acknowledgements before submitting.' }, { status: 400 });
  }
  const application = tryoutApplicationSchema.parse(parsed.data);
  const reviewToken = formData.get('reviewToken');
  const secret = process.env.APPLICANT_PLAN_SIGNING_SECRET;
  if (typeof reviewToken !== 'string' || !secret || !verifyTryoutApplication(application, reviewToken, secret)) {
    return NextResponse.json({ error: 'The application changed after review. Generate a new review brochure before submitting.' }, { status: 400 });
  }

  const evidenceFile = formData.get('evidence');
  if (!(evidenceFile instanceof File) || evidenceFile.name !== application.evidenceFilename) {
    return NextResponse.json({ error: 'Attach the same résumé or game video that you reviewed.' }, { status: 400 });
  }
  let evidence;
  try {
    evidence = validateTryoutEvidence({
      filename: evidenceFile.name,
      contentType: evidenceFile.type || 'application/octet-stream',
      content: Buffer.from(await evidenceFile.arrayBuffer())
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'The tryout evidence could not be validated.' }, { status: 400 });
  }

  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
  if (!url || !key) return NextResponse.json({ error: 'Private tryout storage is not configured. Nothing was submitted.' }, { status: 503 });
  const reference = `DU-TRY-${new Date().getUTCFullYear()}-${application.submissionId.slice(0, 8).toUpperCase()}`;
  const brochurePath = `${reference}/tryout-application.pdf`;
  const evidencePath = `${reference}/${evidence.kind}-${randomUUID().slice(0, 8)}.${evidence.extension}`;
  const pdf = createTryoutApplicationPdf(application, reference, new Date().toISOString().slice(0, 10), 'SUBMITTED - COACH REVIEW PENDING');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const brochureUpload = await supabase.storage.from('tryout-applications').upload(brochurePath, pdf, { contentType: 'application/pdf', upsert: false });
  if (brochureUpload.error) return NextResponse.json({ error: 'Tryout brochure storage failed. Nothing was submitted.' }, { status: 502 });
  const evidenceUpload = await supabase.storage.from('tryout-applications').upload(evidencePath, evidence.content, { contentType: evidence.contentType, upsert: false });
  if (evidenceUpload.error) {
    await supabase.storage.from('tryout-applications').remove([brochurePath]);
    return NextResponse.json({ error: 'Résumé or video storage failed. Nothing was submitted.' }, { status: 502 });
  }

  const stored = await supabase.from('athletic_tryout_applications').insert({
    reference,
    campus: application.campus,
    sport: application.sport,
    tryout_session: application.session,
    applicant_name: application.applicantName,
    applicant_email: application.applicantEmail,
    applicant_phone: application.applicantPhone,
    age_group: application.ageGroup,
    guardian_name: application.guardianName || null,
    guardian_email: application.guardianEmail || null,
    health_participation_notes: application.healthParticipationNotes || null,
    insurance_status: application.insuranceStatus,
    insurance_provider: application.insuranceProvider || null,
    insurance_member_last4: application.insuranceMemberLast4 || null,
    athletic_history: application.athleticHistory,
    evidence_path: evidencePath,
    evidence_filename: evidence.filename,
    evidence_kind: evidence.kind,
    brochure_path: brochurePath,
    consented_at: new Date().toISOString(),
    status: 'notification_pending'
  });
  if (stored.error) {
    await supabase.storage.from('tryout-applications').remove([brochurePath, evidencePath]);
    return NextResponse.json({ error: 'Tryout application storage failed. Nothing was submitted.' }, { status: 502 });
  }

  const [brochureLink, evidenceLink] = await Promise.all([
    supabase.storage.from('tryout-applications').createSignedUrl(brochurePath, 60 * 60 * 24 * 7),
    supabase.storage.from('tryout-applications').createSignedUrl(evidencePath, 60 * 60 * 24 * 7)
  ]);
  if (brochureLink.error || evidenceLink.error) {
    return NextResponse.json({ error: 'Secure review links could not be created. Quote your application ID when contacting Digital-UNI.' }, { status: 502 });
  }

  const summary = [
    `Tryout application: ${reference}`,
    `Applicant: ${application.applicantName} <${application.applicantEmail}>`,
    `Campus: ${tryoutCampusLabels[application.campus]}`,
    `Sport: ${tryoutSportLabels[application.sport]}`,
    `Session: ${tryoutSessionLabels[application.session]}`,
    `Evidence: ${evidence.filename} (${evidence.kind})`,
    `Private coaching-review evidence link (expires in 7 days): ${evidenceLink.data.signedUrl}`,
    '',
    tryoutDisclaimer
  ].join('\n');
  const [internalDelivery, applicantDelivery] = await Promise.all([
    sendTransactionalEmail({
      to: ['enroll@digital-uni.net'],
      replyTo: application.applicantEmail,
      subject: `AI Pioneers Sharks tryout ${reference}`,
      text: `${summary}\n\nThe professional tryout brochure is attached. Sensitive participation information is included only in the private brochure and database record.`,
      attachments: [{ filename: `${reference}-tryout-brochure.pdf`, content: pdf, contentType: 'application/pdf' }],
      idempotencyKey: `digital-uni-tryout/${reference}/internal`,
      messageId: `<tryout-${reference.toLowerCase()}@digital-uni.net>`
    }),
    sendTransactionalEmail({
      to: [application.applicantEmail],
      replyTo: 'enroll@digital-uni.net',
      subject: `Your AI Pioneers Sharks tryout application ${reference}`,
      text: `Your reviewed tryout application was submitted for authorized coaching review.\n\n${summary.replace(evidenceLink.data.signedUrl, '[available only to authorized reviewers]')}`,
      attachments: [{ filename: `${reference}-tryout-brochure.pdf`, content: pdf, contentType: 'application/pdf' }],
      idempotencyKey: `digital-uni-tryout/${reference}/applicant`,
      messageId: `<tryout-copy-${reference.toLowerCase()}@digital-uni.net>`
    })
  ]);
  const emailDelivered = internalDelivery.accepted && applicantDelivery.accepted;
  if (emailDelivered) {
    await supabase.from('athletic_tryout_applications').update({ status: 'coach_review_pending' }).eq('reference', reference);
  }
  return NextResponse.json({
    submitted: true,
    reference,
    brochureUrl: brochureLink.data.signedUrl,
    emailDelivered
  });
}
