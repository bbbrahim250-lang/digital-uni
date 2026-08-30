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

      <section id="digital-uni-streaming" className="scroll-mt-24 bg-navy-900 px-4 py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full border border-gold-400/50 bg-gold-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold-400">
              {t('streaming.kicker')}
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">{t('items.digitalUni.title')}</h2>
            <p className="mt-5 text-lg leading-8 text-navy-50/80">{t('items.digitalUni.description')}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {(['classes', 'courses', 'certifications', 'sports'] as const).map((item) => (
                <span key={item} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-navy-50">
                  {t(`streaming.catalog.${item}`)}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-highlight-turquoise/30 bg-highlight-turquoise/10 p-5">
              <strong className="text-highlight-turquoise">{t('streaming.sportsTitle')}</strong>
              <p className="mt-2 text-sm leading-7 text-navy-50/80">{t('streaming.sportsDescription')}</p>
            </div>
            <p className="mt-6 text-sm leading-7 text-navy-50/65">{t('streaming.availability')}</p>
            <Link href={`/${locale}/enrollment`} className="mt-7 inline-flex rounded-lg bg-gold-500 px-5 py-3 font-bold text-navy-900 transition hover:bg-gold-400">
              {t('streaming.cta')}
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-3xl pb-8" role="img" aria-label={t('streaming.devicePreviewAlt')}>
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#07111f] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gold-500 px-2 py-1 text-[10px] font-black text-navy-900">UNI</span>
                  <span className="text-sm font-black">DIGITAL-UNI STREAM</span>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-bold text-emerald-300">{t('streaming.desktop')}</span>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-[1.3fr_0.7fr] sm:p-7">
                <div className="flex min-h-52 flex-col justify-end rounded-xl bg-[radial-gradient(circle_at_75%_20%,rgba(20,230,190,0.45),transparent_32%),linear-gradient(135deg,#152b47,#07111f)] p-6">
                  <span className="w-fit rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">● {t('streaming.liveHd')}</span>
                  <strong className="mt-3 max-w-sm text-2xl">{t('streaming.sportsSampleTitle')}</strong>
                  <span className="mt-4 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/15"><span className="block h-full w-2/5 rounded-full bg-highlight-turquoise" /></span>
                </div>
                <div className="grid gap-3">
                  {(['classes', 'courses', 'certifications', 'sports'] as const).map((item, index) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <span className="text-xs font-black text-gold-400">0{index + 1}</span>
                      <p className="mt-2 text-sm font-bold">{t(`streaming.catalog.${item}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 end-3 w-36 overflow-hidden rounded-[1.75rem] border-4 border-white/20 bg-[#050b14] p-2 shadow-2xl sm:end-8 sm:w-44">
              <div className="rounded-[1.25rem] bg-navy-900 p-3">
                <div className="mx-auto h-1 w-10 rounded-full bg-white/20" />
                <p className="mt-4 text-center text-[10px] font-black text-gold-400">{t('streaming.mobile')}</p>
                <div className="mt-3 aspect-[4/3] rounded-lg bg-[radial-gradient(circle_at_65%_25%,rgba(20,230,190,0.5),transparent_35%),linear-gradient(135deg,#17304e,#08111e)]" />
                <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-red-300">● {t('streaming.liveHd')}</p>
                <p className="mt-1 text-[10px] font-bold leading-4">{t('streaming.sportsSampleTitle')}</p>
                <div className="mt-3 h-1 rounded-full bg-white/15"><span className="block h-full w-2/5 rounded-full bg-highlight-turquoise" /></div>
              </div>
            </div>
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
              if (key === 'digitalUni') return null;
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
