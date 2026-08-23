'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { copyrightRemovalFormSchema, type CopyrightRemovalFormValues } from '@/lib/schemas';

export async function submitCopyrightRemoval(values: CopyrightRemovalFormValues) {
  const parsed = copyrightRemovalFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: 'Invalid submission. Please check the form fields.' };
  }

  const supabase = createSupabaseServerClient();

  // Try to resolve the reported course by its public URL so reviewers get a
  // direct link from the moderation queue; not required for the request to
  // be accepted (Section 4: process must work even for unlisted content).
  let courseId: string | null = null;
  if (parsed.data.courseUrl) {
    const { data } = await supabase
      .from('courses')
      .select('id')
      .or(`original_course_url.eq.${parsed.data.courseUrl},authorized_embed_url.eq.${parsed.data.courseUrl}`)
      .maybeSingle();
    courseId = data?.id ?? null;
  }

  const { error } = await supabase.from('copyright_requests').insert({
    course_id: courseId,
    submitted_by_name: parsed.data.submittedByName,
    submitted_by_email: parsed.data.submittedByEmail,
    claim_description: parsed.data.claimDescription,
    evidence_url: parsed.data.evidenceUrl || null
  });

  if (error) {
    return { ok: false as const, error: 'Something went wrong submitting your request. Please try again.' };
  }

  return { ok: true as const };
}
