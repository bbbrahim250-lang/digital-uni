import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { CopyrightRemovalForm } from './removal-form';

export default async function CopyrightRemovalPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.copyrightRemoval' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <CopyrightRemovalForm />
    </StaticPage>
  );
}
