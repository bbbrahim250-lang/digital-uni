import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { Card, Badge } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function CourseDetailPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const supabase = createSupabaseServerClient();
  const { data: course } = await supabase
    .from('courses')
    .select('*, institutions(name), providers(name), instructors(full_name)')
    .eq('slug', params.slug)
    .eq('publication_status', 'published')
    .maybeSingle();

  if (!course) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      {course.is_demonstration && <Badge tone="demo">Demonstration Content</Badge>}
      <h1 className="mt-2 text-3xl font-bold text-navy-900">{course.title}</h1>
      <p className="mt-2 text-sm text-navy-400">
        {course.institutions?.name ?? course.providers?.name} · {course.instructors?.full_name}
      </p>

      <p className="mt-6 text-navy-600">{course.description}</p>

      <Card className="mt-8">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          <dt className="text-navy-400">Difficulty</dt>
          <dd className="text-navy-900">{course.difficulty ?? '—'}</dd>
          <dt className="text-navy-400">Original language</dt>
          <dd className="text-navy-900">{course.original_language}</dd>
          <dt className="text-navy-400">Subtitle languages</dt>
          <dd className="text-navy-900">{course.subtitle_languages?.join(', ') || 'None yet'}</dd>
          <dt className="text-navy-400">Translation status</dt>
          <dd className="text-navy-900">{course.translation_status}</dd>
          <dt className="text-navy-400">Certificate</dt>
          <dd className="text-navy-900">
            {course.has_certificate ? `Issued by ${course.certificate_provider ?? course.institutions?.name}` : 'Not offered'}
          </dd>
          <dt className="text-navy-400">Last verified</dt>
          <dd className="text-navy-900">{course.last_verification_date ?? 'Not yet verified'}</dd>
        </dl>
      </Card>

      <Card className="mt-4 border-gold-500/40 bg-gold-200/10">
        <p className="text-sm text-navy-600">{course.copyright_notice}</p>
        {course.original_course_url && (
          <a href={course.original_course_url} className="mt-2 inline-block text-sm font-medium text-highlight-electric underline">
            View original course at {course.institutions?.name ?? course.providers?.name}
          </a>
        )}
      </Card>

      {/* Save-course / add-to-pathway / report-content actions require an
          authenticated user context — wired up alongside the student
          dashboard in Milestone 3. */}
    </article>
  );
}
