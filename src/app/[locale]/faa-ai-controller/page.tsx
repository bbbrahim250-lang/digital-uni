import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Badge, Card } from '@/components/ui/card';

const proposedCurriculum = [
  'AI-assisted air-traffic control simulation',
  'Airport tower communication',
  'Aviation phraseology',
  'Airspace and flight operations',
  'Human factors',
  'Safety and risk management',
  'Weather and emergency procedures',
  'Decision-support systems',
  'Machine learning for aviation',
  'Digital-twin airport environments',
  'Voice-recognition training',
  'Controller performance analytics',
  'Aviation cybersecurity',
  'FAA examination and career preparation'
];

export default async function FaaAiControllerPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.faaAiController' });

  return (
    <StaticPage title={t('title')} intro="">
      <Card className="border-2 border-gold-500 bg-gold-200/30">
        <Badge tone="gold">Program status: Concept under development</Badge>
        <p className="mt-3 text-sm font-semibold text-navy-900">{t('intro')}</p>
      </Card>

      <h2 className="mt-8 text-xl font-semibold text-navy-900">Proposed curriculum</h2>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {proposedCurriculum.map((item) => (
          <li key={item} className="rounded-md border border-navy-100 px-3 py-2 text-sm text-navy-600">
            {item}
          </li>
        ))}
      </ul>

      <Card className="mt-8">
        <p className="text-sm text-navy-400">
          Simulator: placeholder — a future interactive module will appear here once curriculum review is complete.
        </p>
      </Card>
    </StaticPage>
  );
}
