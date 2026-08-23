import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="bg-gradient-to-b from-navy-900 to-navy-600 px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('heroHeadline')}</h1>
        <p className="mt-5 text-lg text-navy-50/90">{t('heroSubheadline')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/courses`}
            className="rounded-md bg-gold-500 px-6 py-3 font-medium text-navy-900 hover:bg-gold-400"
          >
            {t('heroCta')}
          </Link>
          <Link
            href={`/${locale}/pathways`}
            className="rounded-md border border-navy-50/40 px-6 py-3 font-medium text-white hover:bg-navy-600"
          >
            {t('heroSecondaryCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
