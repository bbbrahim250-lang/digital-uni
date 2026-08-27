'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';
import { sendTransactionalEmail } from '@/lib/email';

const ENROLLMENT_RECIPIENTS = ['enroll@digital-uni.net', 'financial_aid@digital-uni.net'];

async function sendEnrollmentEmail(data: ContactFormValues, locale: string, submittedAt: string) {
  const delivery = await sendTransactionalEmail({
    to: ENROLLMENT_RECIPIENTS,
    replyTo: data.email,
    subject: `Digital-UNI™ enrollment/account request: ${data.program}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Selected program: ${data.program}`,
      `Subject: ${data.subject || 'Not provided'}`,
      `Message: ${data.message}`,
      `Submission time: ${submittedAt}`,
      `Preferred language: ${locale}`,
      '',
      `Delivered to: ${ENROLLMENT_RECIPIENTS.join(', ')}`
    ].join('\n'),
    messageId: `<enrollment-${crypto.randomUUID()}@digital-uni.net>`
  });

  return delivery.accepted;
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
