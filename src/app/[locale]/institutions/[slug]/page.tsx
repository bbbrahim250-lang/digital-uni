import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { Card, Badge } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function InstitutionDetailPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const supabase = createSupabaseServerClient();
  const { data: institution } = await supabase
    .from('institutions')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!institution) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      {institution.is_demonstration && <Badge tone="demo">Demonstration Content</Badge>}
      <h1 className="mt-2 text-3xl font-bold text-navy-900">{institution.name}</h1>
      <p className="mt-4 text-navy-600">{institution.description}</p>

      <Card className="mt-6">
        <p className="text-sm text-navy-400">Authorization status</p>
        <Badge tone="gold">{institution.authorization_status.replaceAll('_', ' ')}</Badge>
      </Card>
    </article>
  );
}
