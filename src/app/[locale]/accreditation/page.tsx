import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Card } from '@/components/ui/card';

const roadmapSteps = [
  'Curriculum development',
  'Industry advisory-board review',
  'College-partnership outreach',
  'State CTE application',
  'FAA consultation and program review',
  'Technology-provider alignment',
  'Pilot implementation',
  'Learning-outcome evaluation',
  'Formal approval or accreditation application',
  'Public launch following authorization'
];

export default async function AccreditationPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.accreditation' });
  const tLegal = await getTranslations({ locale, namespace: 'legal' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <Card className="border-gold-500/50 bg-gold-200/20">
        <p className="text-sm font-medium text-navy-900">{tLegal('noAccreditationClaim')}</p>
      </Card>

      <ol className="mt-8 space-y-3">
        {roadmapSteps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-navy-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-900">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </StaticPage>
  );
}
