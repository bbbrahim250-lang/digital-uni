import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: {
    title: 'Community Support Letter — AI Lycée Paris 8',
    subject: 'Proposal to explore co-location of Digital-UNI AI Lycée Paris 8 with Lycée Chaptal',
    address: 'Lycée Chaptal · 45 Boulevard des Batignolles · 75008 Paris, France',
    body: [
      'We respectfully support opening a formal discussion to explore whether Digital-UNI AI Lycée Paris 8 could share appropriate educational space or programming with Lycée Chaptal, subject to the agreement of Lycée Chaptal and every required public, educational, safety and administrative authorization.',
      'The proposed AI Lycée Paris 8 would focus on applied artificial intelligence, mathematics, robotics, computer science, cybersecurity, AI arts and film, entrepreneurship, and preparation for the jobs and industries emerging from Industrial Revolution 4.0.',
      'A co-location discussion could examine shared or complementary laboratories, classrooms, workshops, cultural activities and technology programs while preserving the identity, governance, admissions, responsibilities and legal requirements of each institution.',
      'This letter expresses community support for discussion and evaluation only. It does not state that Lycée Chaptal, the City of Paris, the Académie de Paris, the French Ministry of National Education, or any other authority has approved, endorsed or agreed to the proposal.'
    ],
    sign: 'Support this proposal',
    back: 'Back to AI Lycée Paris 8'
  },
  fr: {
    title: 'Lettre de soutien communautaire — AI Lycée Paris 8',
    subject: 'Proposition d’étudier une co-localisation de Digital-UNI AI Lycée Paris 8 avec le Lycée Chaptal',
    address: 'Lycée Chaptal · 45 boulevard des Batignolles · 75008 Paris, France',
    body: [
      'Nous soutenons respectueusement l’ouverture d’une discussion formelle afin d’étudier la possibilité pour Digital-UNI AI Lycée Paris 8 de partager des espaces pédagogiques appropriés ou certains programmes avec le Lycée Chaptal, sous réserve de l’accord du Lycée Chaptal et de toutes les autorisations publiques, éducatives, administratives et de sécurité requises.',
      'Le projet AI Lycée Paris 8 serait centré sur l’intelligence artificielle appliquée, les mathématiques, la robotique, l’informatique, la cybersécurité, les arts et le cinéma IA, l’entrepreneuriat et la préparation aux métiers issus de la quatrième révolution industrielle.',
      'Une discussion sur la co-localisation pourrait étudier des laboratoires, salles de classe, ateliers, activités culturelles et programmes technologiques partagés ou complémentaires, tout en préservant l’identité, la gouvernance, les admissions, les responsabilités et les obligations juridiques propres à chaque établissement.',
      'Cette lettre exprime un soutien communautaire à l’étude et au dialogue uniquement. Elle ne signifie pas que le Lycée Chaptal, la Ville de Paris, l’Académie de Paris, le ministère de l’Éducation nationale ou toute autre autorité a approuvé, soutenu ou accepté cette proposition.'
    ],
    sign: 'Soutenir cette proposition',
    back: 'Retour à AI Lycée Paris 8'
  },
  ar: {
    title: 'رسالة دعم مجتمعي — AI Lycée Paris 8',
    subject: 'مقترح لدراسة استضافة مشتركة لـ Digital-UNI AI Lycée Paris 8 مع Lycée Chaptal',
    address: 'Lycée Chaptal · 45 Boulevard des Batignolles · 75008 Paris, France',
    body: [
      'ندعم فتح نقاش رسمي لدراسة إمكانية مشاركة Digital-UNI AI Lycée Paris 8 لمساحات تعليمية مناسبة أو برامج مع Lycée Chaptal، شريطة موافقة Lycée Chaptal والحصول على جميع الموافقات التعليمية والإدارية ومتطلبات السلامة والسلطات المختصة.',
      'يركز المشروع على الذكاء الاصطناعي التطبيقي والرياضيات والروبوتات وعلوم الحاسوب والأمن السيبراني وفنون وأفلام الذكاء الاصطناعي وريادة الأعمال والاستعداد لوظائف الثورة الصناعية الرابعة.',
      'يمكن لدراسة الاستضافة المشتركة أن تبحث المختبرات والفصول وورش العمل والأنشطة الثقافية والبرامج التقنية المشتركة أو المتكاملة مع الحفاظ على هوية وحوكمة وقبول ومسؤوليات ومتطلبات كل مؤسسة.',
      'تعبر هذه الرسالة عن دعم مجتمعي للنقاش والدراسة فقط، ولا تعني أن Lycée Chaptal أو مدينة باريس أو Académie de Paris أو وزارة التربية الوطنية الفرنسية أو أي جهة أخرى قد وافقت على المقترح أو أيدته.'
    ],
    sign: 'دعم هذا المقترح',
    back: 'العودة إلى AI Lycée Paris 8'
  }
} as const;

export default function ParisSupportLetterPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  return (
    <main className="bg-navy-50 px-4 py-14 md:py-20">
      <article className="mx-auto max-w-4xl rounded-3xl border border-navy-100 bg-white p-8 shadow-card md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-gold-600">Digital-UNI · AI Lycée Paris 8</p>
        <h1 className="mt-4 text-3xl font-black text-navy-900 md:text-5xl">{c.title}</h1>
        <p className="mt-5 font-bold text-navy-800">{c.subject}</p>
        <p className="mt-2 text-sm text-navy-500">{c.address}</p>
        <div className="mt-8 space-y-5 text-base leading-8 text-navy-700">{c.body.map((p) => <p key={p}>{p}</p>)}</div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact?subject=paris-8-colocation-support`} className="rounded-xl bg-gold-500 px-6 py-3 font-black text-navy-900 hover:bg-gold-400">{c.sign}</Link>
          <Link href={`/${locale}/ai-high-school/paris`} className="rounded-xl border border-navy-200 px-6 py-3 font-bold text-navy-800 hover:bg-navy-50">{c.back}</Link>
        </div>
      </article>
    </main>
  );
}
