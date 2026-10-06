import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: {
    kicker: 'Industrial Revolution 4.0 · Research workstream',
    title: 'NESU — Nur Energy Settlement Unit',
    intro: 'A proposed institutional settlement architecture for energy and strategic-resource trade. The current workstream focuses on transparent pricing references, sovereign corridors, permissioned participation, auditable settlement, and legal/regulatory review.',
    status: 'Research status',
    statusText: 'Conceptual / pre-regulatory. NESU is not represented here as an approved currency, security, payment system, central-bank instrument, or regulated financial-market infrastructure.',
    principles: 'Current design principles',
    items: [
      ['Transparent reference pricing', 'Energy and strategic-resource settlement should use clearly defined, independently observable market references rather than unilateral discretionary repricing.'],
      ['Sovereign settlement corridors', 'Each participating state or authorized institution would operate through a defined legal, compliance, and settlement corridor.'],
      ['Permissioned institutional participation', 'The present concept is aimed at sovereigns, central banks, state-linked energy entities, and approved institutional counterparties—not retail issuance.'],
      ['Proportional participation', 'Governance and membership concepts can be evaluated against measurable trade participation instead of political discretion.'],
      ['Infrastructure-funded fees', 'A defined portion of settlement fees may be allocated to settlement infrastructure, resilience, verification, and corridor operations.'],
      ['Auditable interoperability', 'Messages, pricing inputs, approvals, settlement events, provenance, and exceptions should be reconstructable across participating systems.']
    ],
    architecture: 'Research architecture',
    architectureText: 'The next engineering phase should separate pricing reference, identity/compliance, reserve or collateral logic, corridor authorization, settlement execution, and audit/provenance into independently testable services with explicit interfaces.',
    review: 'Independent review requested',
    reviewText: 'Digital-UNI welcomes comments from qualified legal counsel, financial-market infrastructure specialists, central-bank and payment-system experts, energy-market specialists, cybersecurity engineers, Islamic-finance scholars, universities, and regulators. Review does not imply endorsement.',
    contact: 'Contact the NESU workstream',
    back: 'Back to Digital-UNI'
  },
  fr: {
    kicker: 'Industrie 4.0 · Axe de recherche',
    title: 'NESU — Nur Energy Settlement Unit',
    intro: 'Une architecture institutionnelle proposée pour le règlement des échanges d’énergie et de ressources stratégiques. Le chantier actuel porte sur des références de prix transparentes, des corridors souverains, une participation permissionnée, un règlement auditable et l’examen juridique/réglementaire.',
    status: 'Statut de recherche',
    statusText: 'Conceptuel / pré-réglementaire. NESU n’est pas présenté ici comme une monnaie approuvée, un titre financier, un système de paiement, un instrument de banque centrale ou une infrastructure de marché réglementée.',
    principles: 'Principes de conception actuels',
    items: [
      ['Références de prix transparentes', 'Le règlement doit s’appuyer sur des références de marché clairement définies et observables plutôt que sur une fixation discrétionnaire unilatérale.'],
      ['Corridors souverains', 'Chaque État ou institution autorisée opérerait par un corridor juridique, de conformité et de règlement défini.'],
      ['Participation institutionnelle permissionnée', 'Le concept vise actuellement les États, banques centrales, entreprises énergétiques publiques et contreparties institutionnelles approuvées, et non le détail.'],
      ['Participation proportionnelle', 'La gouvernance peut être étudiée par rapport à une participation commerciale mesurable.'],
      ['Frais dédiés à l’infrastructure', 'Une part définie des frais pourrait financer l’infrastructure, la résilience, la vérification et l’exploitation des corridors.'],
      ['Interopérabilité auditable', 'Messages, prix, approbations, règlements, provenance et exceptions doivent pouvoir être reconstruits entre systèmes participants.']
    ],
    architecture: 'Architecture de recherche',
    architectureText: 'La prochaine phase d’ingénierie doit séparer la référence de prix, l’identité/conformité, les réserves ou garanties, l’autorisation des corridors, l’exécution du règlement et l’audit/provenance en services testables avec des interfaces explicites.',
    review: 'Examen indépendant recherché',
    reviewText: 'Digital-UNI sollicite les commentaires de conseils juridiques qualifiés, spécialistes des infrastructures de marché, banques centrales, systèmes de paiement, marchés de l’énergie, cybersécurité, finance islamique, universités et régulateurs. Un examen ne vaut pas approbation.',
    contact: 'Contacter le chantier NESU',
    back: 'Retour à Digital-UNI'
  },
  ar: {
    kicker: 'الثورة الصناعية الرابعة · مسار بحثي',
    title: 'NESU — وحدة نور لتسوية الطاقة',
    intro: 'هندسة مؤسسية مقترحة لتسوية تجارة الطاقة والموارد الاستراتيجية. يركز المسار الحالي على مراجع تسعير شفافة، وممرات سيادية، ومشاركة مؤسسية بإذن، وتسوية قابلة للتدقيق، ومراجعة قانونية وتنظيمية.',
    status: 'حالة البحث',
    statusText: 'مفهوم بحثي / ما قبل التنظيم. لا تُعرض NESU هنا كعملة معتمدة أو ورقة مالية أو نظام دفع أو أداة بنك مركزي أو بنية سوق مالية منظمة.',
    principles: 'مبادئ التصميم الحالية',
    items: [
      ['مراجع تسعير شفافة', 'يُفترض أن تعتمد التسوية على مراجع سوق واضحة ومستقلة وقابلة للملاحظة بدل التسعير التقديري الأحادي.'],
      ['ممرات تسوية سيادية', 'تعمل كل دولة أو مؤسسة مخولة عبر ممر قانوني وامتثالي وتسوياتي محدد.'],
      ['مشاركة مؤسسية بإذن', 'المفهوم الحالي موجه للدول والبنوك المركزية وشركات الطاقة الحكومية والجهات المؤسسية المعتمدة، وليس للإصدار للأفراد.'],
      ['مشاركة متناسبة', 'يمكن تقييم الحوكمة والعضوية مقابل حجم مشاركة تجارية قابل للقياس بدل القرار السياسي التقديري.'],
      ['رسوم لتمويل البنية التحتية', 'يمكن تخصيص جزء محدد من رسوم التسوية للبنية التحتية والمرونة والتحقق وتشغيل الممرات.'],
      ['تشغيل بيني قابل للتدقيق', 'يجب أن تكون الرسائل ومصادر الأسعار والموافقات وأحداث التسوية وسلسلة المصدر والاستثناءات قابلة لإعادة البناء عبر الأنظمة المشاركة.']
    ],
    architecture: 'الهندسة البحثية',
    architectureText: 'ينبغي أن تفصل المرحلة الهندسية التالية بين مرجع التسعير والهوية/الامتثال ومنطق الاحتياطي أو الضمان وترخيص الممر وتنفيذ التسوية والتدقيق/سلسلة المصدر ضمن خدمات قابلة للاختبار بواجهات واضحة.',
    review: 'مطلوب تقييم مستقل',
    reviewText: 'ترحب Digital-UNI بملاحظات المستشارين القانونيين المؤهلين وخبراء البنية التحتية للأسواق والبنوك المركزية وأنظمة الدفع والطاقة والأمن السيبراني والتمويل الإسلامي والجامعات والجهات التنظيمية. المراجعة لا تعني التأييد أو الموافقة.',
    contact: 'تواصل مع مسار NESU',
    back: 'العودة إلى Digital-UNI'
  }
} as const;

export default function NesuPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = copy[locale];

  return (
    <main className="min-h-screen bg-navy-950 text-white">
      <section className="border-b border-white/10 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold-400">{t.kicker}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-navy-100">{t.intro}</p>
          <div className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{t.status}</p>
            <p className="mt-3 leading-7 text-navy-100">{t.statusText}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black">{t.principles}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {t.items.map(([title, body], index) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-black tracking-[0.18em] text-emerald-300">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-black text-gold-300">{title}</h3>
                <p className="mt-3 leading-7 text-navy-100">{body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-emerald-300/25 bg-emerald-950/25 p-7">
              <h2 className="text-2xl font-black text-emerald-200">{t.architecture}</h2>
              <p className="mt-4 leading-7 text-navy-100">{t.architectureText}</p>
            </section>
            <section className="rounded-3xl border border-sky-300/25 bg-sky-950/25 p-7">
              <h2 className="text-2xl font-black text-sky-200">{t.review}</h2>
              <p className="mt-4 leading-7 text-navy-100">{t.reviewText}</p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="mailto:NESU_Project@digital-UNI.net?subject=NESU%20Research%20Review" className="rounded-xl bg-gold-500 px-5 py-3 font-black text-navy-950 hover:bg-gold-400">{t.contact}</a>
            <Link href={`/${locale}`} className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10">{t.back}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
