import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Card } from '@/components/ui/card';

const proposedFields = [
  'Computer Science',
  'Information Technology',
  'Artificial Intelligence and Machine Learning',
  'Software Development',
  'Cybersecurity',
  'Data Science',
  'Business and Entrepreneurship',
  'E-commerce',
  'Aviation Technology',
  'Robotics and Automation'
];

export default async function CtePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.cte' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <Card className="border-gold-500/50 bg-gold-200/20">
        <p className="text-sm font-medium text-navy-900">
          Digital-UNI completion certificates are distinct from state-approved CTE credentials. State approval, where
          pursued, is tracked per jurisdiction and shown on each program's status.
        </p>
      </Card>

      <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {proposedFields.map((field) => (
          <li key={field} className="rounded-md border border-navy-100 px-3 py-2 text-sm text-navy-600">
            {field}
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}
