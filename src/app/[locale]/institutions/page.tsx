import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { institutionDirectoryItems } from '@/lib/site-directories';

export default async function InstitutionsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'institutionDirectory' });

  return (
    <main className="bg-navy-50 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{t('eyebrow')}</p>
        <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-navy-900 md:text-6xl">{t('title')}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-600">{t('intro')}</p>

        <div className="mt-8 rounded-2xl border border-gold-400/50 bg-gold-200/40 p-6">
          <p className="font-bold leading-7 text-navy-900">{t('issuerNotice')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {institutionDirectoryItems.map(({ key, anchor }, index) => (
            <section id={anchor} key={key} className="scroll-mt-28 rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-black text-gold-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="rounded-full bg-gold-200/60 px-3 py-1 text-xs font-bold text-gold-600">{t('certificateBadge')}</span>
              </div>
              <h2 className="mt-6 text-xl font-black text-navy-900">{t(`items.${key}.title`)}</h2>
              <p className="mt-3 text-sm leading-7 text-navy-600">{t(`items.${key}.description`)}</p>
              <Link href={`/${locale}/enrollment`} className="mt-6 inline-flex text-sm font-bold text-highlight-electric hover:underline">
                {t('exploreCta')} →
              </Link>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 text-sm leading-7 text-navy-600">
          <strong className="text-navy-900">{t('digitalBankTitle')}</strong> {t('digitalBankNotice')}
        </div>
        <div className="mt-5 rounded-2xl border border-highlight-turquoise/40 bg-white p-6 text-sm leading-7 text-navy-600">
          <strong className="text-navy-900">{t('futureCurrencyTitle')}:</strong> {t('futureCurrencyNotice')}
        </div>
      </div>
    </main>
  );
}
