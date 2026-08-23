import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="bg-gradient-to-b from-navy-900 to-navy-600 px-4 py-16 text-center text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('heroHeadline')}</h1>
        <p className="mt-5 text-lg text-navy-50/90">{t('heroSubheadline')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/industrial-revolution-4`}
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
        <Link href={`/${locale}/industrial-revolution-4`} className="mt-12 block overflow-hidden rounded-2xl border border-gold-400/40 shadow-2xl">
          <Image src="/images/industrial-revolution-4-showcase.webp" alt="Digital-UNI Industrial Revolution 4.0 professional learning portfolio" width={1536} height={1024} priority className="h-auto w-full" />
        </Link>
        <Link href={`/${locale}/ai-high-school`} className="mt-8 inline-block text-gold-200 hover:text-gold-400">
          {t('highSchoolCta')} →
        </Link>
      </div>
    </section>
  );
}
