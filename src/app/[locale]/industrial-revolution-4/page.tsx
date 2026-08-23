import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const disciplineKeys = ['ai', 'cybersecurity', 'cryptocurrency', 'blockchain'] as const;
const projectKeys = ['neural', 'clustering', 'regression', 'data'] as const;

export default async function IndustrialRevolutionPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'showcase' });
  const legal = await getTranslations({ locale, namespace: 'legal' });

  return (
    <article>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 px-4 py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">Digital-UNI · Industrial Revolution 4.0</p>
          <h1 className="mx-auto mt-5 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">{t('title')}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-navy-50">{t('subtitle')}</p>
          <Image src="/images/industrial-revolution-4-showcase.webp" alt={t('posterAlt')} width={1536} height={1024} priority className="mt-12 h-auto w-full rounded-2xl border border-gold-400/30 shadow-2xl" />
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="#disciplines" className="rounded-lg bg-gold-400 px-6 py-3 font-semibold text-navy-900">{t('explore')}</Link>
            <Link href={`/${locale}/pathways`} className="rounded-lg border border-white/40 px-6 py-3">{t('portfolio')}</Link>
            <Link href={`/${locale}/certifications`} className="rounded-lg border border-white/40 px-6 py-3">{t('certification')}</Link>
          </div>
        </div>
      </section>

      <section id="disciplines" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold text-navy-900">{t('disciplinesTitle')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {disciplineKeys.map((key, index) => (
            <section key={key} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
              <p className="text-sm font-bold tracking-widest text-gold-600">0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold text-navy-900">{t(`disciplines.${key}.title`)}</h3>
              <p className="mt-4 leading-7 text-navy-400">{t(`disciplines.${key}.description`)}</p>
              <p className="mt-5 rounded-lg bg-navy-50 p-4 text-sm leading-7 text-navy-600">{t(`disciplines.${key}.pathway`)}</p>
              <Link href={`/${locale}/pathways`} className="mt-6 inline-block font-semibold text-highlight-electric">{t('explorePathway')} →</Link>
            </section>
          ))}
        </div>
      </section>

      <section className="bg-navy-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-navy-900">{t('projectsTitle')}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {projectKeys.map((key) => (
              <div key={key} className="rounded-xl bg-white p-7 shadow-card">
                <h3 className="text-xl font-semibold text-navy-900">{t(`projects.${key}.title`)}</h3>
                <p className="mt-3 leading-7 text-navy-400">{t(`projects.${key}.description`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-lg border border-gold-400/40 bg-white p-5 text-sm leading-6 text-navy-600">{legal('noAccreditationClaim')}</p>
        </div>
      </section>
    </article>
  );
}
