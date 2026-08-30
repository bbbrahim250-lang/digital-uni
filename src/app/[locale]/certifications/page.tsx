import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { certificationDirectoryItems } from '@/lib/site-directories';

export default async function CertificationsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'certificationDirectory' });

  return (
    <main className="bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{t('eyebrow')}</p>
        <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-navy-900 md:text-6xl">{t('title')}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-600">{t('intro')}</p>

        <div className="mt-8 rounded-2xl border border-gold-400/50 bg-gold-200/30 p-6">
          <p className="font-bold leading-7 text-navy-900">{t('issuerNotice')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificationDirectoryItems.map(({ key, anchor }) => (
            <section id={anchor} key={key} className="scroll-mt-28 rounded-2xl border border-navy-100 bg-navy-50 p-7 shadow-card">
              <span className="inline-flex rounded-full bg-navy-900 px-3 py-1 text-xs font-black uppercase tracking-wider text-gold-400">{t(`items.${key}.track`)}</span>
              <h2 className="mt-5 text-xl font-black text-navy-900">{t(`items.${key}.title`)}</h2>
              <p className="mt-3 text-sm leading-7 text-navy-600">{t(`items.${key}.description`)}</p>
              <Link href={`/${locale}/enrollment`} className="mt-6 inline-flex text-sm font-bold text-highlight-electric hover:underline">
                {t('exploreCta')} →
              </Link>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
