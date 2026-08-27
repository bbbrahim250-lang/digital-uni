'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { campaignSupportSchema, type CampaignSupportValues } from '@/lib/schemas';
import { sendTransactionalEmail } from '@/lib/email';

const DIGITAL_UNI_RECIPIENTS = ['enroll@digital-uni.net', 'financial_aid@digital-uni.net'];
const CITY_COUNCIL_RECIPIENT = 'council.mailbox@santamonica.gov';

export type CampaignSubmissionResult =
  | { ok: true; backupStored: boolean }
  | {
      ok: false;
      code: 'invalid_submission' | 'verification_failed' | 'delivery_unavailable' | 'delivery_failed';
    };

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { configured: false, success: false };

  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store'
    });
    const result = (await response.json()) as { success?: boolean };
    return { configured: true, success: response.ok && result.success === true };
  } catch {
    return { configured: true, success: false };
  }
}

async function sendCampaignEmail(
  data: CampaignSupportValues,
  locale: string,
  submittedAt: string,
  message: string
) {
  const subject = `Community support — Santa Monica AI High School — ${data.signatureName}`;
  const text = [
    message,
    '',
    `Supporter email: ${data.email}`,
    `Submission time: ${submittedAt}`,
    `Preferred language: ${locale}`,
    '',
    `Delivery: Digital-UNI (${DIGITAL_UNI_RECIPIENTS.join(', ')}) with a copy to the Santa Monica City Council Office (${CITY_COUNCIL_RECIPIENT}).`
  ].join('\n');

  return sendTransactionalEmail({
    to: DIGITAL_UNI_RECIPIENTS,
    cc: [CITY_COUNCIL_RECIPIENT],
    replyTo: data.email,
    subject,
    text,
    idempotencyKey: `ai-high-school-campaign/${data.submissionId}`,
    messageId: `<ai-high-school-${data.submissionId}@digital-uni.net>`
  });
}

export async function submitCampaignSupport(
  locale: string,
  values: CampaignSupportValues
): Promise<CampaignSubmissionResult> {
  const parsed = campaignSupportSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, code: 'invalid_submission' };
  }

  // Quietly accept bot-filled honeypot submissions without storing or sending them.
  if (parsed.data.website) {
    return { ok: true, backupStored: true };
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.configured) {
    console.error('campaign_support_turnstile_not_configured');
    return { ok: false, code: 'delivery_unavailable' };
  }
  if (!turnstile.success) {
    return { ok: false, code: 'verification_failed' };
  }

  const submittedAt = new Date().toISOString();
  const message = [
    'SANTA MONICA AI HIGH SCHOOL COMMUNITY SUPPORT',
    `Full name: ${parsed.data.name}`,
    `ZIP code: ${parsed.data.zipCode}`,
    `Community connection: ${parsed.data.connection}`,
    `Primary interest: ${parsed.data.interest}`,
    `Phone: ${parsed.data.phone || 'Not provided'}`,
    '',
    parsed.data.message || 'No additional comment provided.',
    '',
    `Electronic signature: ${parsed.data.signatureName}`,
    'Electronic-signature acknowledgement confirmed: The typed name is adopted as the signer’s electronic signature and the submitted information is accurate.',
    'Campaign consent confirmed: Add this person to the Digital-UNI community-support campaign and contact them with project updates.',
    `City-copy authorization confirmed: Send this submission and contact information to ${CITY_COUNCIL_RECIPIENT}.`,
    'Legal acknowledgement confirmed: This registration is not a statutory municipal initiative signature or ballot-petition signature.'
  ].join('\n');

  // Email is the primary delivery path requested by the campaign owner.
  const email = await sendCampaignEmail(parsed.data, locale, submittedAt, message);
  if (!email.configured) {
    console.error('campaign_support_email_not_configured');
    return { ok: false, code: 'delivery_unavailable' };
  }
  if (!email.accepted) {
    return { ok: false, code: 'delivery_failed' };
  }

  // Supabase is the private backup record. Email acceptance is not undone if backup storage fails.
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('contact_submissions').insert({
    id: parsed.data.submissionId,
    name: parsed.data.name,
    email: parsed.data.email,
    subject: `[AI HIGH SCHOOL CAMPAIGN] ${parsed.data.connection} | ${parsed.data.zipCode}`,
    program: 'Santa Monica AI-Native Private High School',
    message,
    locale,
    created_at: submittedAt
  });

  if (error && error.code !== '23505') {
    console.error('campaign_support_storage_failed', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return { ok: true, backupStored: false };
  }

  return { ok: true, backupStored: true };
}
