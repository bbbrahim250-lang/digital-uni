import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { streamingStudioItems } from '@/lib/site-directories';

const creativeTracks = ['movies', 'art', 'scripts', 'virtualProduction'] as const;

const brandStyles = {
  netflix: { mark: 'N', className: 'bg-black text-[#e50914] text-6xl font-black' },
  hulu: { mark: 'hulu', className: 'bg-[#061a12] text-[#1ce783] text-4xl font-black lowercase' },
  tubi: { mark: 'tubi', className: 'bg-[#35155d] text-white text-4xl font-black lowercase' },
  pluto: { mark: 'pluto tv', className: 'bg-black text-white text-3xl font-black lowercase' },
  primeVideo: { mark: 'prime video', className: 'bg-[#071c2c] text-[#00a8e1] text-3xl font-black lowercase' },
  appleTv: { mark: '● tv+', className: 'bg-black text-white text-4xl font-semibold' }
} as const;

export default async function AiStudiosPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'studioDirectory' });

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy-900 px-4 py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(20,230,190,0.22),transparent_35%),radial-gradient(circle_at_15%_75%,rgba(255,196,43,0.18),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-gold-400">{t('eyebrow')}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight md:text-7xl">{t('title')}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-navy-50/85 md:text-xl">{t('intro')}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}/enrollment`} className="rounded-lg bg-gold-500 px-5 py-3 font-bold text-navy-900 transition hover:bg-gold-400">
              {t('enrollCta')}
            </Link>
            <a href="#platform-pathways" className="rounded-lg border border-white/30 px-5 py-3 font-bold transition hover:bg-white/10">
              {t('platformCta')}
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{t('creativeEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900 md:text-5xl">{t('creativeTitle')}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {creativeTracks.map((track, index) => (
              <article key={track} className="rounded-2xl border border-navy-100 bg-navy-50 p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-lg font-black text-gold-400">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 text-xl font-black text-navy-900">{t(`creative.${track}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-navy-600">{t(`creative.${track}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform-pathways" className="scroll-mt-24 bg-navy-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-electric">{t('platformEyebrow')}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black text-navy-900 md:text-5xl">{t('platformTitle')}</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-600">{t('platformIntro')}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {streamingStudioItems.map(({ key, anchor }) => {
              const brand = brandStyles[key];
              return (
                <article id={anchor} key={key} className="scroll-mt-28 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
                  <div className={`flex h-28 items-center justify-center tracking-tight ${brand.className}`} role="img" aria-label={t(`items.${key}.brandAlt`)}>
                    {brand.mark}
                  </div>
                  <div className="p-7">
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-gold-600">{t(`items.${key}.track`)}</span>
                    <h3 className="mt-3 text-xl font-black text-navy-900">{t(`items.${key}.title`)}</h3>
                    <p className="mt-3 text-sm leading-7 text-navy-600">{t(`items.${key}.description`)}</p>
                    <Link href={`/${locale}/enrollment`} className="mt-6 inline-flex text-sm font-bold text-highlight-electric hover:underline">
                      {t('exploreCta')} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-gold-400/50 bg-gold-200/30 p-6 text-sm leading-7 text-navy-700">
            <strong className="text-navy-900">{t('independentTitle')}</strong> {t('independentNotice')}
          </div>
        </div>
      </section>
    </main>
  );
}
