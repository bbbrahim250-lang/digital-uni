import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: {
    eyebrow: 'Paris community-support campaign', title: 'Help create a Digital-UNI AI Lycée in Paris',
    intro: 'A community-led proposal for a French–English AI lycée. We are building public support and searching across Paris for a suitable vacant building; no arrondissement or site has been selected yet.',
    cta: 'Explore enrollment planning', back: 'View all AI High Schools', focusTitle: 'Proposed academic focus',
    communityEyebrow: 'The site search is open', communityTitle: 'Support the Paris initiative or recommend a vacant building',
    communityText: 'Residents, families, educators, local businesses, associations, property owners, architects, and civic partners can express support or identify a potentially suitable vacant building. Every candidate property would still require owner consent, feasibility review, financing, zoning and building-use confirmation, safety and accessibility review, and all required education approvals.',
    siteBadge: 'Proposed vacant building site · not yet selected', supportCta: 'Support the Paris campaign', siteCta: 'Recommend a vacant site',
    historyTitle: 'Founded in France in 2017', historyText: 'Digital-UNI’s organizational history began in France. Corporate and education-registration details can be published after the exact identifiers and supporting records are verified.',
    focus: [
      ['AI, Mathematics & Computer Science', 'Algorithms, Python, data, machine learning, mathematical reasoning, and responsible AI projects.'],
      ['Sciences, Robotics & Engineering', 'Physics, electronics, automation, robotics, prototyping, and laboratory investigation.'],
      ['AI Arts, Cinema & Fashion', 'Applied AI for Paris creative industries, including visual arts, film, design, music, and fashion.'],
      ['French–English International Learning', 'Bilingual academic communication, global collaboration, and pathways toward French and international higher education.'],
      ['Entrepreneurship & Commercial Applications', 'From idea initiation through product design, intellectual property awareness, validation, publication, and responsible growth.'],
      ['Professional & University Pathways', 'Portfolio development and Digital-UNI professional preparation alongside future authorized school and university relationships.']
    ],
    statusTitle: 'A proposed initiative—authorization still required',
    status: 'Digital-UNI has not secured a Paris site or authorization to operate a French lycée. Any opening would require an appropriate facility, financing, French education declarations and approvals, safety and accessibility compliance, staffing, curriculum review, and other applicable national and City of Paris requirements. No affiliation with the French Ministry of Education, the Académie de Paris, the Mairie de Paris, or an existing lycée is claimed.'
  },
  fr: {
    eyebrow: 'Campagne de soutien communautaire à Paris', title: 'Aidez à créer un lycée IA Digital-UNI à Paris',
    intro: 'Un projet communautaire de lycée franco-anglais. Nous mobilisons le soutien du public et recherchons dans Paris un bâtiment vacant adapté ; aucun arrondissement ni site n’est encore sélectionné.',
    cta: 'Explorer la préparation à l’inscription', back: 'Voir tous les lycées IA', focusTitle: 'Orientation pédagogique proposée',
    communityEyebrow: 'La recherche de site est ouverte', communityTitle: 'Soutenir l’initiative parisienne ou proposer un bâtiment vacant',
    communityText: 'Habitants, familles, enseignants, entreprises locales, associations, propriétaires, architectes et partenaires publics peuvent manifester leur soutien ou signaler un bâtiment vacant potentiellement adapté. Tout site proposé devra faire l’objet de l’accord du propriétaire, d’études de faisabilité, d’un financement, de vérifications d’urbanisme et d’usage, de sécurité et d’accessibilité, ainsi que des autorisations éducatives requises.',
    siteBadge: 'Site vacant proposé · non sélectionné à ce jour', supportCta: 'Soutenir la campagne à Paris', siteCta: 'Proposer un site vacant',
    historyTitle: 'Fondée en France en 2017', historyText: 'L’histoire de Digital-UNI a commencé en France. Les informations relatives à la société et à l’enregistrement de l’activité de formation pourront être publiées après vérification des identifiants exacts et des justificatifs.',
    focus: [
      ['IA, mathématiques et informatique', 'Algorithmes, Python, données, apprentissage automatique, raisonnement mathématique et projets d’IA responsable.'],
      ['Sciences, robotique et ingénierie', 'Physique, électronique, automatisation, robotique, prototypage et expérimentation.'],
      ['Arts IA, cinéma et mode', 'IA appliquée aux industries créatives parisiennes : arts visuels, cinéma, design, musique et mode.'],
      ['Parcours international franco-anglais', 'Communication académique bilingue, collaboration mondiale et préparation aux études supérieures.'],
      ['Entrepreneuriat et applications commerciales', 'De l’idée au produit : conception, propriété intellectuelle, validation, publication et développement responsable.'],
      ['Parcours professionnels et universitaires', 'Portfolio et préparation professionnelle Digital-UNI avec de futurs partenariats autorisés.']
    ],
    statusTitle: 'Un projet proposé—autorisations requises',
    status: 'Digital-UNI n’a pas encore sécurisé de site à Paris ni reçu l’autorisation d’exploiter un lycée en France. Toute ouverture nécessiterait un local adapté, un financement, les déclarations et autorisations éducatives françaises, la conformité en matière de sécurité et d’accessibilité, le recrutement et l’examen du programme. Aucune affiliation avec le ministère de l’Éducation nationale, l’Académie de Paris, la Mairie de Paris ou un lycée existant n’est revendiquée.'
  },
  ar: {
    eyebrow: 'حملة دعم مجتمعي في باريس', title: 'ساهموا في إنشاء ثانوية Digital-UNI للذكاء الاصطناعي في باريس',
    intro: 'مقترح مجتمعي لثانوية فرنسية–إنجليزية. نعمل على حشد الدعم العام والبحث في باريس عن مبنى شاغر مناسب؛ ولم تُختر أي دائرة أو موقع بعد.',
    cta: 'استكشف تخطيط التسجيل', back: 'عرض جميع ثانويات الذكاء الاصطناعي', focusTitle: 'المحاور الأكاديمية المقترحة',
    communityEyebrow: 'البحث عن الموقع مفتوح', communityTitle: 'ادعم مبادرة باريس أو اقترح مبنى شاغراً',
    communityText: 'يمكن للسكان والعائلات والمعلمين والشركات المحلية والجمعيات وأصحاب العقارات والمهندسين المعماريين والشركاء المدنيين إعلان دعمهم أو اقتراح مبنى شاغر قد يكون مناسباً. ويظل أي عقار مقترح خاضعاً لموافقة المالك ودراسة الجدوى والتمويل والتحقق من التخطيط واستعمال المبنى والسلامة وإمكانية الوصول وجميع التراخيص التعليمية المطلوبة.',
    siteBadge: 'موقع مبنى شاغر مقترح · لم يُختر بعد', supportCta: 'ادعم حملة باريس', siteCta: 'اقترح موقعاً شاغراً',
    historyTitle: 'تأسست في فرنسا عام 2017', historyText: 'بدأ تاريخ Digital-UNI المؤسسي في فرنسا. ويمكن نشر بيانات الشركة وتسجيل نشاط التدريب بعد التحقق من الأرقام الدقيقة والوثائق الداعمة.',
    focus: [
      ['الذكاء الاصطناعي والرياضيات والمعلوماتية', 'الخوارزميات وPython والبيانات والتعلم الآلي والاستدلال الرياضي ومشاريع الذكاء الاصطناعي المسؤول.'],
      ['العلوم والروبوتات والهندسة', 'الفيزياء والإلكترونيات والأتمتة والروبوتات والنماذج الأولية والعمل المخبري.'],
      ['فنون الذكاء الاصطناعي والسينما والموضة', 'تطبيق الذكاء الاصطناعي في الفنون البصرية والسينما والتصميم والموسيقى والموضة في باريس.'],
      ['تعليم دولي فرنسي–إنجليزي', 'تواصل أكاديمي ثنائي اللغة وتعاون عالمي واستعداد للتعليم العالي الفرنسي والدولي.'],
      ['ريادة الأعمال والتطبيقات التجارية', 'من إطلاق الفكرة إلى تصميم المنتج والملكية الفكرية والتحقق والنشر والنمو المسؤول.'],
      ['مسارات مهنية وجامعية', 'تطوير ملف الإنجاز والتحضير المهني مع علاقات مدرسية وجامعية مستقبلية مرخّصة.']
    ],
    statusTitle: 'مبادرة مقترحة—تتطلب الترخيص',
    status: 'لم تؤمّن Digital-UNI بعد موقعاً في باريس ولم تحصل على ترخيص لتشغيل ثانوية فرنسية. يتطلب الافتتاح منشأة مناسبة وتمويلاً وتصريحات وموافقات التعليم الفرنسي والامتثال للسلامة وإمكانية الوصول والتوظيف ومراجعة المنهج. ولا يُدّعى أي انتساب إلى وزارة التربية الفرنسية أو أكاديمية باريس أو بلدية باريس أو أي ثانوية قائمة.'
  }
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isValidLocale(params.locale)) notFound();
  const c = copy[params.locale as Locale];
  return { title: c.title, description: c.intro };
}

export default function ParisAiLyceePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  return <main className="bg-white">
    <section className="relative overflow-hidden bg-navy-900 px-4 py-20 text-white md:py-28">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div><p className="text-sm font-black uppercase tracking-[.22em] text-gold-400">{c.eyebrow}</p><h1 className="mt-5 text-4xl font-black tracking-tight md:text-7xl">{c.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-navy-50 md:text-xl">{c.intro}</p><div className="mt-8 flex flex-wrap gap-4"><Link href={`/${locale}/enrollment`} className="rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900">{c.cta}</Link><Link href={`/${locale}/ai-high-school#campus-selector`} className="rounded-xl border border-white/30 px-6 py-3.5 font-bold">{c.back}</Link></div></div>
        <div className="rounded-3xl border border-gold-400/35 bg-white p-6 shadow-2xl"><Image src="/images/digital-uni-institutional-ai-badge.png" alt="Digital-UNI Institutional AI Badge" width={1024} height={1024} className="mx-auto h-auto w-full max-w-sm object-contain" /></div>
      </div>
    </section>
    <section className="border-b border-navy-100 bg-white px-4 py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[.2em] text-highlight-turquoise">{c.communityEyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900 md:text-5xl">{c.communityTitle}</h2>
          <p className="mt-5 max-w-4xl leading-8 text-navy-600">{c.communityText}</p>
          <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50 p-5">
            <h3 className="font-black text-navy-900">{c.historyTitle}</h3>
            <p className="mt-2 text-sm leading-7 text-navy-600">{c.historyText}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href={`/${locale}/contact?subject=Paris%20AI%20Lyc%C3%A9e%20community%20support`} className="rounded-xl bg-navy-900 px-6 py-3.5 font-black text-white">{c.supportCta}</Link>
            <Link href={`/${locale}/contact?subject=Paris%20AI%20Lyc%C3%A9e%20vacant%20building%20recommendation`} className="rounded-xl border border-navy-200 px-6 py-3.5 font-black text-navy-900">{c.siteCta}</Link>
          </div>
        </div>
        <aside className="rounded-3xl border border-dashed border-gold-500 bg-gold-200/25 p-8 text-center">
          <span className="inline-flex rounded-full bg-gold-500 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-navy-900">{c.siteBadge}</span>
          <div className="mx-auto mt-7 flex h-36 w-full max-w-xs items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 bg-white text-6xl" aria-hidden="true">🏫</div>
        </aside>
      </div>
    </section>
    <section className="bg-navy-50 px-4 py-16 md:py-20"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-black text-navy-900 md:text-5xl">{c.focusTitle}</h2><div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{c.focus.map(([title, description], index) => <article key={title} className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card"><span className="text-sm font-black text-gold-600">0{index + 1}</span><h3 className="mt-3 text-xl font-bold text-navy-900">{title}</h3><p className="mt-3 text-sm leading-7 text-navy-600">{description}</p></article>)}</div><div className="mt-12 rounded-3xl border border-gold-400/50 bg-gold-200/30 p-7 md:p-9"><h2 className="text-2xl font-black text-navy-900">{c.statusTitle}</h2><p className="mt-4 max-w-5xl leading-8 text-navy-600">{c.status}</p></div></div></section>
  </main>;
}
