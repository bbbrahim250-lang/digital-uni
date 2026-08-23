'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';

export async function submitContactForm(locale: string, values: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: 'Invalid submission. Please check the form fields.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
    locale
  });

  if (error) {
    return { ok: false as const, error: 'Something went wrong submitting your message. Please try again.' };
  }

  return { ok: true as const };
}
