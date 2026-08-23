import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';

export default async function AccessibilityPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.accessibility' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <p className="text-sm text-navy-400">{tCommon('contentPending')}</p>
    </StaticPage>
  );
}
