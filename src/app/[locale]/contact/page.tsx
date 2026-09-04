import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { ContactForm } from './contact-form';

export default async function ContactPage({ params, searchParams }: { params: { locale: string }; searchParams: { subject?: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <ContactForm locale={locale} initialSubject={searchParams.subject?.slice(0, 120)} />
    </StaticPage>
  );
}
