import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const supportKeys = ['athletics', 'aiLabs', 'scholarships', 'community'] as const;
const campusKeys = ['santaMonica', 'paloAlto'] as const;
const campusLogos = {
  santaMonica: {
    src: '/images/digital-uni-ai-pioneers-sharks-santa-monica.webp',
    width: 1122,
    height: 1402,
    altKey: 'santaMonicaLogoAlt'
  },
  paloAlto: {
    src: '/images/digital-uni-ai-pioneers-sharks-palo-alto.webp',
    width: 1217,
    height: 1293,
    altKey: 'paloAltoLogoAlt'
  }
} as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'campusDirectory.fundPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [
        '/images/digital-uni-ai-pioneers-sharks-santa-monica.webp',
        '/images/digital-uni-ai-pioneers-sharks-palo-alto.webp'
      ]
    }
  };
}

export default async function AiPioneersFundPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'campusDirectory.fundPage' });

  const fundingEmail = (campus: string) =>
    `mailto:financial_aid@digital-uni.net?subject=${encodeURIComponent(`AI Pioneers Sharks Fund — ${campus}`)}`;

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-navy-900 px-4 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(47,182,168,.28),transparent_27%),radial-gradient(circle_at_82%_78%,rgba(217,181,89,.2),transparent_30%)]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-3 sm:gap-5">
            {campusKeys.map((key) => {
              const logo = campusLogos[key];
              return (
                <div key={key} className="rounded-2xl bg-white p-2 shadow-2xl shadow-black/40 sm:p-3">
                  <Image
                    src={logo.src}
                    alt={t(logo.altKey)}
                    width={logo.width}
                    height={logo.height}
                    priority
                    sizes="(max-width: 1024px) 42vw, 250px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              );
            })}
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-highlight-turquoise">{t('eyebrow')}</p>
            <div className="mt-5 border-s-4 border-gold-400 ps-5">
              <p className="text-lg font-bold uppercase tracking-[0.16em] text-gold-400">Digital-UNI</p>
              <p className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">{t('teamName')}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-navy-50/70">{t('teamSubtitle')}</p>
            </div>
            <h1 className="mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">{t('title')}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-50/85">{t('intro')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#campus-funds" className="rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900 shadow-xl hover:bg-gold-400">{t('chooseCta')}</a>
              <a href={fundingEmail(t('teamName'))} className="rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-bold hover:bg-white/10">{t('contactCta')}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="campus-funds" className="scroll-mt-24 bg-navy-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{t('campusEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900 md:text-5xl">{t('campusTitle')}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy-600">{t('campusIntro')}</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {campusKeys.map((key, index) => (
              <article key={key} className={`overflow-hidden rounded-3xl border p-8 shadow-card ${index === 0 ? 'border-highlight-turquoise/40 bg-gradient-to-br from-white to-emerald-50' : 'border-gold-400/40 bg-gradient-to-br from-white to-gold-200/30'}`}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <Image
                    src={campusLogos[key].src}
                    alt={t(campusLogos[key].altKey)}
                    width={campusLogos[key].width}
                    height={campusLogos[key].height}
                    sizes="190px"
                    className="h-44 w-40 shrink-0 rounded-xl bg-white object-contain p-1"
                  />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-600">{t(`campuses.${key}.status`)}</p>
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.1em] text-highlight-turquoise">{t('teamName')}</p>
                    <h3 className="mt-2 text-2xl font-black text-navy-900">{t(`campuses.${key}.title`)}</h3>
                  </div>
                </div>
                <p className="mt-6 leading-8 text-navy-600">{t(`campuses.${key}.description`)}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={fundingEmail(t(`campuses.${key}.title`))} className="rounded-xl bg-navy-900 px-5 py-3 text-sm font-black text-white hover:bg-navy-600">{t(`campuses.${key}.cta`)}</a>
                  <Link href={`/${locale}/${key === 'santaMonica' ? 'ai-high-school' : 'ai-high-school/palo-alto'}`} className="rounded-xl border border-navy-100 bg-white px-5 py-3 text-sm font-bold text-navy-900 hover:border-gold-400">{t('viewCampusCta')}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-navy-900 md:text-5xl">{t('supportTitle')}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy-600">{t('supportIntro')}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {supportKeys.map((key, index) => (
              <article key={key} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-sm font-black text-gold-400">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-black text-navy-900">{t(`support.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-navy-600">{t(`support.${key}.description`)}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-gold-400/50 bg-gold-200/30 p-7 md:p-9">
            <h2 className="text-2xl font-black text-navy-900">{t('transparencyTitle')}</h2>
            <p className="mt-4 max-w-5xl leading-8 text-navy-600">{t('transparencyText')}</p>
            <a href={fundingEmail(t('teamName'))} className="mt-6 inline-flex rounded-xl bg-navy-900 px-6 py-3.5 font-black text-white hover:bg-navy-600">{t('contactCta')}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
