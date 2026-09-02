import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { ApplicantAssistant } from './applicant-assistant';
import { isTransactionalEmailConfigured } from '@/lib/email';

export const dynamic = 'force-dynamic';

const pageCopy = {
  en: {
    kicker: 'Digital-UNI · Program admissions', title: 'Choose a program. Build a pathway that is yours.',
    intro: 'Explore professional and executive programs, create a personalized Digital-UNI brochure, and review every detail with your résumé before you personally submit it.',
    programs: 'Program options', formats: 'Pathway formats', human: 'Human review remains decisive', humanText: 'AI may organize a preliminary proposal; authorized people review enrollment and course approval.',
    support: 'Admissions support', supportTitle: 'Need a person before you continue?', supportText: 'Speak with Digital-UNI about program fit, financial-aid information, or the human counselor review route. No payment is collected by the brochure planner.',
    email: 'Email an advisor', call: 'Call 213-708-4890', emailWarning: 'Automated email delivery is not configured. Secure brochure review can still be prepared in the browser; contact enroll@digital-uni.net for assistance.'
  },
  fr: {
    kicker: 'Digital-UNI · Admissions', title: 'Choisissez un programme. Construisez un parcours qui vous ressemble.',
    intro: 'Explorez les programmes professionnels et exécutifs, créez une brochure Digital-UNI personnalisée et vérifiez chaque détail avec votre CV avant de l’envoyer vous-même.',
    programs: 'Programmes proposés', formats: 'Formats de parcours', human: 'La décision humaine reste essentielle', humanText: 'L’IA peut organiser une proposition préliminaire; les personnes autorisées examinent l’inscription et l’approbation des cours.',
    support: 'Aide aux admissions', supportTitle: 'Besoin de parler à une personne ?', supportText: 'Contactez Digital-UNI au sujet du choix du programme, de l’aide financière ou de la vérification par un conseiller humain. Aucun paiement n’est prélevé par le planificateur.',
    email: 'Écrire à un conseiller', call: 'Appeler le 213-708-4890', emailWarning: 'L’envoi automatique par e-mail n’est pas configuré. La brochure peut être préparée dans le navigateur; contactez enroll@digital-uni.net.'
  },
  ar: {
    kicker: 'Digital-UNI · القبول في البرامج', title: 'اختر برنامجًا وابنِ مسارًا يناسبك.',
    intro: 'استكشف البرامج المهنية والتنفيذية، وأنشئ كتيب Digital-UNI شخصيًا، وراجع كل التفاصيل مع سيرتك الذاتية قبل أن ترسل الطلب بنفسك.',
    programs: 'خيارات البرامج', formats: 'صيغ المسارات', human: 'تبقى المراجعة البشرية حاسمة', humanText: 'يمكن للذكاء الاصطناعي تنظيم مقترح أولي؛ ويراجع الأشخاص المخولون التسجيل والموافقة على المقررات.',
    support: 'دعم القبول', supportTitle: 'هل تحتاج إلى التحدث مع شخص؟', supportText: 'تواصل مع Digital-UNI بشأن ملاءمة البرنامج أو معلومات المساعدة المالية أو مسار مراجعة المستشار البشري. لا يجمع مخطط الكتيب أي دفعة.',
    email: 'راسل مستشارًا', call: 'اتصل على 213-708-4890', emailWarning: 'لم يتم إعداد الإرسال التلقائي للبريد. لا يزال من الممكن إعداد مراجعة الكتيب في المتصفح؛ تواصل مع enroll@digital-uni.net.'
  }
} as const;

export default async function EnrollmentPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { promo?: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'enrollment' });
  const legal = await getTranslations({ locale, namespace: 'legal' });
  const c = pageCopy[locale];
  const hasTuitionDiscount = searchParams.promo?.toUpperCase() === 'TUITION10';
  const plannerEnabled = Boolean(process.env.OPENAI_API_KEY && process.env.APPLICANT_PLAN_SIGNING_SECRET);

  return (
    <article className="bg-[#f5f7fa]">
      <section className="relative overflow-hidden bg-navy-900 px-4 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 78% 15%, #2fb6a8 0, transparent 32%), linear-gradient(120deg, transparent 45%, rgba(217,181,89,.28))" }} />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gold-400">{c.kicker}</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-[-.035em] md:text-7xl">{c.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-50">{c.intro}</p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15">
              <div className="bg-navy-900/80 p-5"><strong className="block text-3xl text-gold-400">14</strong><span className="mt-1 block text-xs font-bold uppercase tracking-widest text-white/60">{c.programs}</span></div>
              <div className="bg-navy-900/80 p-5"><strong className="block text-3xl text-emerald-300">2</strong><span className="mt-1 block text-xs font-bold uppercase tracking-widest text-white/60">{c.formats}</span></div>
              <div className="col-span-2 bg-navy-900/80 p-5"><strong className="block text-base">{c.human}</strong><span className="mt-1 block text-xs leading-5 text-white/60">{c.humanText}</span></div>
            </div>
          </div>
          {hasTuitionDiscount ? <div className="mt-8 inline-flex rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-3 text-sm font-bold text-gold-200">{t('discountTitle')} · TUITION10</div> : null}
        </div>
      </section>

      <section id="applicant-assistant" className="scroll-mt-24 py-14">
        <ApplicantAssistant locale={locale} enabled={plannerEnabled} />
      </section>

      <section className="border-t border-navy-100 bg-white px-4 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">{c.support}</p>
            <h2 className="mt-2 text-3xl font-black text-navy-900">{c.supportTitle}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-navy-600">{c.supportText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:enroll@digital-uni.net?subject=Digital-UNI%20program%20advising" className="rounded-xl bg-navy-900 px-5 py-3 font-black text-white">{c.email}</a>
            <a href="tel:+12137084890" className="rounded-xl border border-navy-200 px-5 py-3 font-black text-navy-900">{c.call}</a>
          </div>
        </div>
        {!isTransactionalEmailConfigured() ? <p role="alert" className="mx-auto mt-6 max-w-7xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{c.emailWarning}</p> : null}
        <div className="mx-auto mt-8 grid max-w-7xl gap-3 border-t border-navy-100 pt-6 text-xs leading-5 text-navy-500 md:grid-cols-2">
          <p>{legal('noAccreditationClaim')}</p>
          <p>{t('discountTerms')}</p>
        </div>
        <Link href={`/${locale}/industrial-revolution-4`} className="mx-auto mt-7 block max-w-7xl font-bold text-highlight-electric">{t('explore')} →</Link>
      </section>
    </article>
  );
}
