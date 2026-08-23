import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const focusKeys = ['ai', 'robotics', 'cybersecurity', 'portfolio'] as const;

export default async function AiHighSchoolPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'highSchool' });
  const legal = await getTranslations({ locale, namespace: 'legal' });

  return (
    <article>
      <section className="bg-gradient-to-br from-navy-900 to-navy-600 px-4 py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">Santa Monica · West Los Angeles</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
            <p className="mt-6 text-lg leading-8 text-navy-50">{t('subtitle')}</p>
            <Link href={`/${locale}/contact`} className="mt-8 inline-block rounded-lg bg-gold-400 px-6 py-3 font-semibold text-navy-900">{t('contact')}</Link>
          </div>
          <Image src="/images/industrial-revolution-4-showcase.webp" alt={t('title')} width={1536} height={1024} className="h-auto w-full rounded-2xl border border-gold-400/30 shadow-2xl" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold text-navy-900">{t('focusTitle')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {focusKeys.map((key) => (
            <div key={key} className="rounded-xl border border-navy-100 p-7 shadow-card">
              <h3 className="text-xl font-semibold text-navy-900">{t(`focus.${key}.title`)}</h3>
              <p className="mt-3 leading-7 text-navy-400">{t(`focus.${key}.description`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 rounded-lg border border-gold-400/40 p-5 text-sm leading-6 text-navy-600">{legal('noAccreditationClaim')}</p>
      </section>
    </article>
  );
}
