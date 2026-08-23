import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PathwayDetailPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const supabase = createSupabaseServerClient();
  const { data: pathway } = await supabase
    .from('pathways')
    .select('*, pathway_courses(is_required, recommended_order, courses(slug, title))')
    .eq('slug', params.slug)
    .eq('publication_status', 'published')
    .maybeSingle();

  if (!pathway) notFound();

  const courses = (pathway.pathway_courses ?? []).sort(
    (a: any, b: any) => a.recommended_order - b.recommended_order
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      {pathway.is_demonstration && <Badge tone="demo">Demonstration Content</Badge>}
      <h1 className="mt-2 text-3xl font-bold text-navy-900">{pathway.title}</h1>
      <p className="mt-4 text-navy-600">{pathway.description}</p>

      {pathway.authorization_disclaimer && (
        <Card className="mt-6 border-gold-500/40 bg-gold-200/10">
          <p className="text-sm text-navy-600">{pathway.authorization_disclaimer}</p>
        </Card>
      )}

      <h2 className="mt-8 text-lg font-semibold text-navy-900">Courses in this pathway</h2>
      <ol className="mt-4 space-y-2">
        {courses.map((pc: any, i: number) => (
          <li key={pc.courses.slug}>
            <Link
              href={`/${locale}/courses/${pc.courses.slug}`}
              className="flex items-center justify-between rounded-md border border-navy-100 px-4 py-3 text-sm hover:border-gold-500"
            >
              <span>
                {i + 1}. {pc.courses.title}
              </span>
              <Badge tone={pc.is_required ? 'gold' : 'neutral'}>{pc.is_required ? 'Required' : 'Optional'}</Badge>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
