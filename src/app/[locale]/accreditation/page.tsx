import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

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
const workflowKeys = ['idea', 'architecture', 'prototype', 'validation', 'publication', 'growth'] as const;

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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modelKeys.map((key) => (
            <article key={key} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <h3 className="text-lg font-black text-gold-400">{t(`lab.models.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-6 text-navy-50/75">{t(`lab.models.${key}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-highlight-turquoise">{t('workflow.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-black text-navy-900">{t('workflow.title')}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-navy-600">{t('workflow.intro')}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workflowKeys.map((key, index) => (
            <article key={key} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
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
