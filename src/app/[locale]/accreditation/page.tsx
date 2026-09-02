import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { AiModelRecommender } from './ai-model-recommender';

const roadmapSteps = [
  'Curriculum development',
  'Industry advisory-board review',
  'College-partnership outreach',
  'State CTE application',
  'FAA consultation and program review',
  'Technology-provider alignment',
  'Pilot implementation',
  'Learning-outcome evaluation',
  'Formal approval or accreditation application',
  'Public launch following authorization'
];

const modelKeys = ['openai', 'anthropic', 'google', 'meta', 'mistral', 'openSource'] as const;
const primaryWindowKeys = ['openaiCodex', 'claude', 'gemini'] as const;
const workflowKeys = ['idea', 'architecture', 'prototype', 'validation', 'capstone', 'publication', 'growth'] as const;

export default async function AccreditationPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.accreditation' });
  const tLegal = await getTranslations({ locale, namespace: 'legal' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <Card className="border-gold-500/50 bg-gold-200/20">
        <p className="text-sm font-medium text-navy-900">{tLegal('noAccreditationClaim')}</p>
      </Card>

      <ol className="mt-8 space-y-3">
        {roadmapSteps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-navy-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-900">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <section className="mt-12 overflow-hidden rounded-3xl bg-navy-900 p-6 text-white shadow-2xl md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-highlight-turquoise">{t('lab.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{t('lab.title')}</h2>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-50/80">{t('lab.intro')}</p>

        <div className="mt-9 grid gap-5 xl:grid-cols-3">
          {primaryWindowKeys.map((key, index) => (
            <article key={key} className="overflow-hidden rounded-2xl border border-white/20 bg-[#07111f] shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.06] px-4 py-3">
                <div aria-hidden="true" className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/50">AI Lab window {String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-black uppercase tracking-[.16em] text-highlight-turquoise">{t(`lab.windows.${key}.role`)}</p><h3 className="mt-2 text-2xl font-black text-white">{t(`lab.windows.${key}.title`)}</h3></div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-400/40 bg-gold-400/10 text-lg font-black text-gold-400">{index + 1}</span>
                </div>
                <p className="mt-4 min-h-24 text-sm leading-6 text-navy-50/75">{t(`lab.windows.${key}.description`)}</p>
                <div className="mt-5 rounded-xl border border-emerald-300/15 bg-emerald-300/[.06] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-emerald-200">{t('lab.windowOutput')}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-white">{t(`lab.windows.${key}.output`)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-gold-400/35 bg-gradient-to-r from-gold-400/15 to-emerald-400/10 p-6 md:flex md:items-center md:justify-between md:gap-8">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-gold-400">{t('lab.studio.eyebrow')}</p><h3 className="mt-2 text-2xl font-black">{t('lab.studio.title')}</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-navy-50/75">{t('lab.studio.description')}</p></div>
          <Link href={`/${locale}/enrollment#program-discovery-title`} className="mt-5 inline-flex shrink-0 rounded-xl bg-gold-500 px-5 py-3 text-center font-black text-navy-900 hover:bg-gold-400 md:mt-0">{t('lab.studio.cta')}</Link>
        </div>

        <details className="mt-8 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
          <summary className="cursor-pointer font-black text-gold-400">{t('lab.compareTitle')}</summary>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/65">{t('lab.compareIntro')}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modelKeys.map((key) => (
            <article key={key} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <h3 className="text-lg font-black text-gold-400">{t(`lab.models.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-6 text-navy-50/75">{t(`lab.models.${key}.description`)}</p>
            </article>
          ))}
        </div>
        </details>
        <p className="mt-6 text-xs leading-5 text-white/50">{t('lab.providerNotice')}</p>
      </section>

      <AiModelRecommender locale={locale} />

      <section className="mt-12">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-highlight-turquoise">{t('workflow.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-black text-navy-900">{t('workflow.title')}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-navy-600">{t('workflow.intro')}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflowKeys.map((key, index) => (
            <article key={key} className={`rounded-2xl border bg-white p-6 shadow-card ${key === 'capstone' ? 'border-gold-500 ring-2 ring-gold-200 xl:col-span-2' : 'border-navy-100'}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 font-black text-gold-400">{index + 1}</span>
              <h3 className="mt-4 text-xl font-black text-navy-900">{t(`workflow.steps.${key}.title`)}</h3>
              <p className="mt-2 leading-7 text-navy-600">{t(`workflow.steps.${key}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-highlight-turquoise/40 bg-navy-50 p-7 md:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-highlight-electric">{t('agent.eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900">{t('agent.title')}</h2>
          <p className="mt-4 leading-7 text-navy-600">{t('agent.description')}</p>
          <Link href={`/${locale}/enrollment#applicant-assistant`} className="mt-6 inline-flex rounded-xl bg-navy-900 px-6 py-3 font-black text-white hover:bg-navy-600">{t('agent.cta')}</Link>
        </div>
        <aside className="rounded-3xl bg-gold-200/40 p-7 md:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-gold-600">{t('share.eyebrow')}</p>
          <h2 className="mt-3 text-2xl font-black text-navy-900">{t('share.title')}</h2>
          <p className="mt-4 leading-7 text-navy-600">{t('share.description')}</p>
          <div className="mt-5 rounded-2xl bg-white p-5 text-sm leading-7 text-navy-700 shadow-card">
            <p><strong>10%</strong> — {t('share.donation')}</p>
            <p><strong>15%</strong> — {t('share.commercial')}</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-navy-400">{t('share.definition')}</p>
        </aside>
      </section>
    </StaticPage>
  );
}
