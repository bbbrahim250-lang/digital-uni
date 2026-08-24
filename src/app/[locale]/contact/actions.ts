'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';

const ENROLLMENT_ADDRESS = 'enroll@digital-uni.net';

async function sendEnrollmentEmail(data: ContactFormValues, locale: string, submittedAt: string) {
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !from) return false;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [ENROLLMENT_ADDRESS],
        reply_to: data.email,
        subject: `Digital-UNI™ enrollment request: ${data.program}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Selected program: ${data.program}`,
          `Message: ${data.message}`,
          `Submission time: ${submittedAt}`,
          `Preferred language: ${locale}`
        ].join('\n')
      }),
      cache: 'no-store'
    });

    if (!response.ok) return false;
    const accepted = (await response.json()) as { id?: string };
    return Boolean(accepted.id);
  } catch {
    return false;
  }
}

export async function submitContactForm(locale: string, values: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: 'Invalid submission. Please check the form fields.' };
  }

  const submittedAt = new Date().toISOString();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    program: parsed.data.program,
    message: parsed.data.message,
    locale,
    created_at: submittedAt
  });

  if (error) {
    return { ok: false as const, error: 'Something went wrong submitting your message. Please try again.' };
  }

  const emailAccepted = await sendEnrollmentEmail(parsed.data, locale, submittedAt);
  if (!emailAccepted) {
    return { ok: false as const, error: 'Your request was saved, but notification delivery was not accepted. Please contact enroll@digital-uni.net.' };
  }

  return { ok: true as const };
}
