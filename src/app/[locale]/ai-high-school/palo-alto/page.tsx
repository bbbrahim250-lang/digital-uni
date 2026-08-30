import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const focusKeys = ['aiRobotics', 'cloudCybersecurity', 'entrepreneurship', 'responsibleAi', 'certification', 'educatorWorkforce'] as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'campusDirectory.paloAltoPage' });
  return { title: t('title'), description: t('intro') };
}

export default async function PaloAltoAiHighSchoolPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const [t, campuses] = await Promise.all([
    getTranslations({ locale, namespace: 'campusDirectory.paloAltoPage' }),
    getTranslations({ locale, namespace: 'campusDirectory' })
  ]);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy-900 px-4 py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(47,182,168,.25),transparent_28%),radial-gradient(circle_at_20%_90%,rgba(217,181,89,.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.18fr_.82fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-gold-400">{t('eyebrow')}</p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight md:text-7xl">{t('title')}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-50 md:text-xl">{t('intro')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}/enrollment`} className="rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900 hover:bg-gold-400">{t('enrollmentCta')}</Link>
              <Link href={`/${locale}/ai-high-school/fund`} className="rounded-xl border border-highlight-turquoise/60 bg-highlight-turquoise/10 px-6 py-3.5 font-black text-highlight-turquoise hover:bg-highlight-turquoise/20">{campuses('fundPage.openFund')}</Link>
              <Link href={`/${locale}/ai-high-school#campus-selector`} className="rounded-xl border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10">{t('santaMonicaLink')}</Link>
            </div>
          </div>

          <aside className="flex items-center gap-4 rounded-3xl border border-gold-400/35 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:gap-6 sm:p-7">
            <Image
              src="/images/digital-uni-ai-pioneers-shark-logo.png"
              alt={campuses('fundPage.logoAlt')}
              width={230}
              height={242}
              sizes="(max-width: 640px) 140px, 200px"
              className="h-auto w-32 shrink-0 object-contain sm:w-44"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-highlight-turquoise">Digital-UNI</p>
              <p className="mt-2 text-xl font-black uppercase leading-tight text-gold-400 sm:text-2xl">{campuses('fundPage.teamName')}</p>
              <p className="mt-3 text-xs font-bold uppercase leading-5 tracking-[0.1em] text-navy-50/70">{campuses('fundPage.teamSubtitle')}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-navy-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-navy-900 md:text-5xl">{t('focusTitle')}</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {focusKeys.map((key, index) => (
              <article key={key} className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                <span className="text-sm font-black text-gold-600">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-bold text-navy-900">{t(`focus.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-7 text-navy-600">{t(`focus.${key}.description`)}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-gold-400/50 bg-gold-200/30 p-7 md:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-600">{campuses('items.paloAlto.status')}</p>
            <h2 className="mt-3 text-2xl font-black text-navy-900">{t('statusTitle')}</h2>
            <p className="mt-4 max-w-4xl leading-8 text-navy-600">{t('statusText')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
