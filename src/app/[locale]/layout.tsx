import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, localeDirection, locales, type Locale } from '@/i18n/config';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import '../../styles/globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.locale)) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'site' });

  return {
    title: `${t('name')} — ${t('tagline')}`,
    description: t('tagline'),
    metadataBase: new URL('https://www.digital-uni.net'),
    alternates: {
      canonical: `/${params.locale}`,
      languages: { en: '/en', ar: '/ar', fr: '/fr' }
    },
    openGraph: {
      title: t('name'),
      description: t('tagline'),
      url: `https://www.digital-uni.net/${params.locale}`,
      siteName: t('name'),
      locale: params.locale
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const messages = await getMessages();
  const direction = localeDirection[locale];
  const t = await getTranslations({ locale, namespace: 'a11y' });

 return (
  <div
    lang={locale}
    dir={direction}
    className="min-h-screen bg-white font-sans text-navy-900 antialiased"
  >
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </NextIntlClientProvider>
  </div>
);
}
