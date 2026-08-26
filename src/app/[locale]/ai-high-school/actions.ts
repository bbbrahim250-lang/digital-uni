'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { campaignSupportSchema, type CampaignSupportValues } from '@/lib/schemas';

export type CampaignSubmissionResult =
  | { ok: true }
  | { ok: false; code: 'invalid_submission' | 'submission_failed' };

export async function submitCampaignSupport(
  locale: string,
  values: CampaignSupportValues
): Promise<CampaignSubmissionResult> {
  const parsed = campaignSupportSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, code: 'invalid_submission' };
  }

  // Quietly accept bot-filled honeypot submissions without storing them.
  if (parsed.data.website) {
    return { ok: true };
  }

  const supabase = createSupabaseServerClient();
  const message = [
    'SANTA MONICA AI HIGH SCHOOL COMMUNITY SUPPORT',
    `ZIP code: ${parsed.data.zipCode}`,
    `Community connection: ${parsed.data.connection}`,
    `Primary interest: ${parsed.data.interest}`,
    `Phone: ${parsed.data.phone || 'Not provided'}`,
    '',
    parsed.data.message || 'No additional comment provided.',
    '',
    'Consent confirmed: Add this person to the Digital-UNI community-support campaign and contact them with project updates.',
    'Legal acknowledgement confirmed: This registration is not a statutory municipal initiative signature or ballot petition signature.'
  ].join('\n');

  const { error } = await supabase.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: `[AI HIGH SCHOOL CAMPAIGN] ${parsed.data.connection} | ${parsed.data.zipCode}`,
    message,
    locale
  });

  if (error) {
    return { ok: false, code: 'submission_failed' };
  }

  return { ok: true };
}
