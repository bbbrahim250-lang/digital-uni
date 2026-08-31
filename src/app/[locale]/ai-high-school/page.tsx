import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { campusDirectoryItems } from '@/lib/site-directories';
import { CampaignForm, type CampaignFormCopy } from './campaign-form';

const NOTICE_PDF = '/documents/digital-uni-formal-notice-santa-monica-ai-high-school-2026.pdf';
const DECK_PDF = '/documents/digital-uni-santa-monica-ai-high-school-investor-deck-2026.pdf';
const siteFactKeys = ['landmark', 'district', 'field', 'approvals'] as const;
const priorityKeys = ['school', 'athletics', 'infrastructure', 'pathways'] as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'highSchool.campaign' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${params.locale}/ai-high-school`,
      languages: { en: '/en/ai-high-school', ar: '/ar/ai-high-school', fr: '/fr/ai-high-school' }
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: ['/images/brahim-boumakh-ai-high-school-founder.png']
    }
  };
}

export default async function AiHighSchoolPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const [t, legal, campuses] = await Promise.all([
    getTranslations({ locale, namespace: 'highSchool.campaign' }),
    getTranslations({ locale, namespace: 'legal' }),
    getTranslations({ locale, namespace: 'campusDirectory' })
  ]);

  const formCopy: CampaignFormCopy = {
    name: t('form.name'), email: t('form.email'), phone: t('form.phone'), optional: t('form.optional'),
    zipCode: t('form.zipCode'), connection: t('form.connection'), interest: t('form.interest'),
    message: t('form.message'), messagePlaceholder: t('form.messagePlaceholder'),
    signatureName: t('form.signatureName'), signatureHelp: t('form.signatureHelp'),
    signatureMismatch: t('form.signatureMismatch'), signatureConsent: t('form.signatureConsent'),
    consent: t('form.consent'), cityCopyConsent: t('form.cityCopyConsent'),
    legalAcknowledgement: t('form.legalAcknowledgement'), submit: t('form.submit'), submitting: t('form.submitting'),
    humanVerification: t('form.humanVerification'), verificationUnavailable: t('form.verificationUnavailable'),
    successTitle: t('form.successTitle'), successMessage: t('form.successMessage'),
    referenceLabel: t('form.referenceLabel'), deliveryPendingWarning: t('form.deliveryPendingWarning'),
    invalidSubmission: t('form.invalidSubmission'), submissionFailed: t('form.submissionFailed'),
    verificationFailed: t('form.verificationFailed'), deliveryUnavailable: t('form.deliveryUnavailable'),
    deliveryFailed: t('form.deliveryFailed'), backupWarning: t('form.backupWarning'),
    emailFallback: t('form.emailFallback'),
    requiredError: t('form.requiredError'), emailError: t('form.emailError'), zipError: t('form.zipError'),
    connectionOptions: {
      resident: t('form.connections.resident'), parent_guardian: t('form.connections.parentGuardian'),
      student: t('form.connections.student'), educator: t('form.connections.educator'),
      business_community: t('form.connections.businessCommunity'), other: t('form.connections.other')
    },
    interestOptions: {
      private_ai_high_school: t('form.interests.privateAiHighSchool'),
      ai_pioneers_athletics: t('form.interests.aiPioneersAthletics'),
      technology_workforce: t('form.interests.technologyWorkforce'),
      investment_partnership: t('form.interests.investmentPartnership'),
      volunteer: t('form.interests.volunteer'), general_support: t('form.interests.generalSupport')
    }
  };

  return (
    <article className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-navy-900 px-4 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(47,182,168,0.22),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(217,181,89,0.18),transparent_30%)]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.12fr_.88fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-400">{t('heroEyebrow')}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">{t('heroTitle')}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-50 md:text-xl">{t('heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#resident-support" className="rounded-xl bg-gold-500 px-6 py-3.5 font-bold text-navy-900 shadow-xl transition hover:bg-gold-400">{t('primaryCta')}</a>
              <a href="#formal-notice" className="rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur hover:bg-white/10">{t('noticeCta')}</a>
              <a href={DECK_PDF} target="_blank" rel="noreferrer" className="rounded-xl border border-gold-400/60 px-6 py-3.5 font-semibold text-gold-200 hover:bg-gold-400/10">{t('deckCta')}</a>
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-navy-50/70">{t('heroLegal')}</p>
          </div>

          <figure className="mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold-400/40 bg-navy-800 shadow-2xl shadow-black/40">
              <Image src="/images/brahim-boumakh-ai-high-school-founder.png" alt={t('founderImageAlt')} fill priority sizes="(max-width: 1024px) 90vw, 420px" className="object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900 via-navy-900/90 to-transparent px-6 pb-6 pt-20">
                <p className="text-2xl font-black text-gold-400">Brahim Boumakh</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-white">{t('founderRole')}</p>
              </div>
            </div>
            <figcaption className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-6 text-navy-50/80">{t('founderCredential')}</figcaption>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gold-400/30 bg-white/[0.06] p-4 shadow-xl backdrop-blur">
              <Image
                src="/images/digital-uni-ai-pioneers-sharks-santa-monica.webp"
                alt={campuses('fundPage.santaMonicaLogoAlt')}
                width={1122}
                height={1402}
                sizes="(max-width: 768px) 96px, 112px"
                className="h-28 w-24 shrink-0 rounded-lg bg-white object-contain md:h-32 md:w-28"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-highlight-turquoise">Digital-UNI</p>
                <p className="mt-1 text-lg font-black uppercase text-gold-400">{campuses('fundPage.teamName')}</p>
                <p className="mt-1 text-sm leading-6 text-navy-50/80">{t('priorities.athletics.description')}</p>
                <Link href={`/${locale}/ai-high-school/fund`} className="mt-3 inline-flex text-sm font-black text-white hover:text-gold-400">{campuses('fundPage.openFund')} →</Link>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section id="campus-selector" className="scroll-mt-24 border-b border-navy-100 bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{campuses('eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900">{campuses('chooseTitle')}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-navy-600">{campuses('intro')}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {campusDirectoryItems.map(({ key, href }) => (
              <Link key={key} href={`/${locale}/${href}`} className="rounded-2xl border border-navy-100 bg-navy-50 p-6 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-white">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-gold-600">{campuses(`items.${key}.status`)}</span>
                <h3 className="mt-2 text-2xl font-black text-navy-900">{campuses(`items.${key}.title`)}</h3>
                <p className="mt-3 leading-7 text-navy-600">{campuses(`items.${key}.description`)}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-highlight-electric">{campuses('selectCta')} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-navy-100 bg-navy-50 px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteFactKeys.map((key, index) => (
            <div key={key} className="rounded-2xl border border-white bg-white/90 p-5 shadow-card">
              <p className="text-xs font-black tracking-[0.18em] text-gold-600">0{index + 1}</p>
              <p className="mt-2 font-bold leading-6 text-navy-900">{t(`facts.${key}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-highlight-turquoise">{t('siteKicker')}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy-900 md:text-5xl">{t('siteTitle')}</h2>
              <p className="mt-5 text-lg leading-8 text-navy-600">{t('siteIntro')}</p>
              <div className="mt-7 rounded-2xl border border-gold-400/40 bg-gold-200/30 p-6">
                <h3 className="font-bold text-navy-900">{t('zoningTitle')}</h3>
                <p className="mt-2 text-sm leading-7 text-navy-600">{t('zoningText')}</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-navy-900">{t('prioritiesTitle')}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {priorityKeys.map((key, index) => (
                  <section key={key} className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-black text-gold-400">{index + 1}</div>
                    <h3 className="mt-5 text-xl font-bold text-navy-900">{t(`priorities.${key}.title`)}</h3>
                    <p className="mt-3 leading-7 text-navy-600">{t(`priorities.${key}.description`)}</p>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="formal-notice" className="scroll-mt-24 bg-navy-900 px-4 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.18fr_.82fr]">
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">{t('noticeKicker')}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{t('noticeTitle')}</h2>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-navy-50/70">{t('noticeAddress')}</p>
            <p className="mt-2 text-sm text-gold-200">{t('noticeDate')}</p>
            <div className="mt-8 space-y-5 text-base leading-8 text-navy-50/90">
              <p>{t('noticeParagraph1')}</p><p>{t('noticeParagraph2')}</p><p>{t('noticeParagraph3')}</p><p>{t('noticeParagraph4')}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-7 text-navy-900 shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold-600">PDF · 1 PAGE</p>
              <h3 className="mt-3 text-2xl font-black">{t('noticeDocumentTitle')}</h3>
              <p className="mt-4 leading-7 text-navy-600">{t('noticeDocumentDescription')}</p>
              <a href={NOTICE_PDF} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-xl bg-navy-900 px-5 py-3 font-bold text-white hover:bg-navy-600">{t('openNotice')}</a>
            </div>
            <div className="rounded-3xl border border-gold-400/40 bg-gold-400/10 p-7">
              <h3 className="text-xl font-bold text-gold-200">{t('publicProcessTitle')}</h3>
              <p className="mt-3 text-sm leading-7 text-navy-50/80">{t('publicProcessText')}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-highlight-turquoise">{t('deckKicker')}</p>
              <h2 className="mt-3 text-3xl font-black text-navy-900 md:text-5xl">{t('deckTitle')}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-navy-600">{t('deckDescription')}</p>
            </div>
            <a href={DECK_PDF} target="_blank" rel="noreferrer" className="shrink-0 rounded-xl bg-navy-900 px-6 py-3.5 text-center font-bold text-white hover:bg-navy-600">{t('openDeck')}</a>
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-navy-100 bg-navy-50 shadow-2xl">
            <object data={`${DECK_PDF}#view=FitH`} type="application/pdf" aria-label={t('deckFrameLabel')} className="hidden h-[760px] w-full lg:block">
              <p className="p-8"><a href={DECK_PDF}>{t('openDeck')}</a></p>
            </object>
            <div className="p-8 lg:hidden">
              <p className="leading-7 text-navy-600">{t('deckMobileText')}</p>
              <a href={DECK_PDF} target="_blank" rel="noreferrer" className="mt-5 inline-flex font-bold text-highlight-electric">{t('openDeck')} →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="resident-support" className="scroll-mt-24 bg-navy-50 px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-highlight-turquoise">{t('supportKicker')}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy-900 md:text-5xl">{t('supportTitle')}</h2>
            <p className="mt-5 text-lg leading-8 text-navy-600">{t('supportIntro')}</p>
            <div className="mt-8 flex justify-center rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <Image
                src="/images/digital-uni-ai-pioneers-sharks-santa-monica.webp"
                alt={campuses('fundPage.santaMonicaLogoAlt')}
                width={1122}
                height={1402}
                sizes="240px"
                className="h-auto w-60 object-contain"
              />
            </div>
            <div className="mt-8 rounded-2xl bg-navy-900 p-6 text-white">
              <h3 className="text-xl font-bold text-gold-400">{t('legalTitle')}</h3>
              <p className="mt-3 text-sm leading-7 text-navy-50/80">{t('legalText')}</p>
              <a href="https://www.santamonica.gov/topic-explainers/elections" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-gold-200 hover:text-gold-400">{t('officialElectionSource')} →</a>
            </div>
          </div>
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-2xl md:p-10">
            <CampaignForm
              locale={locale}
              copy={formCopy}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-navy-100 bg-white p-8 shadow-card md:p-10">
          <h2 className="text-2xl font-black text-navy-900">{t('sourcesTitle')}</h2>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
            <a href="https://www.santamonica.gov/press/2025/10/17/city-broadens-pathway-for-exploring-options-to-restore-the-santa-monica-civic-auditorium" target="_blank" rel="noreferrer" className="rounded-full bg-navy-50 px-4 py-2 text-navy-600 hover:text-highlight-electric">{t('sourceCivic')}</a>
            <a href="https://www.santamonica.gov/places/parks/historic-belmar-park" target="_blank" rel="noreferrer" className="rounded-full bg-navy-50 px-4 py-2 text-navy-600 hover:text-highlight-electric">{t('sourceBelmar')}</a>
            <a href="https://www.santamonica.gov/topic-explainers/elections" target="_blank" rel="noreferrer" className="rounded-full bg-navy-50 px-4 py-2 text-navy-600 hover:text-highlight-electric">{t('sourceElections')}</a>
          </div>
          <p className="mt-6 text-sm leading-7 text-navy-400">{legal('noAccreditationClaim')}</p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(92%,34rem)] items-center justify-between gap-4 rounded-2xl border border-gold-400/40 bg-navy-900/95 px-5 py-3 text-white shadow-2xl backdrop-blur md:hidden">
        <p className="text-sm font-bold">{t('mobileCampaignLabel')}</p>
        <a href="#resident-support" className="shrink-0 rounded-lg bg-gold-500 px-4 py-2 text-sm font-black text-navy-900">{t('mobileCampaignCta')}</a>
      </div>
    </article>
  );
}
