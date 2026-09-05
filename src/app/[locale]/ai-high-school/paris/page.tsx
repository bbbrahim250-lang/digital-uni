import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: {
    title: 'Digital-UNI AI Lycée — Paris 8e arrondissement',
    eyebrow: 'Proposed AI Lycée · Paris 8e arrondissement',
    intro: 'A Digital-UNI concept for an AI-native lycée in Paris 8e connecting rigorous secondary education, applied artificial intelligence, robotics, entrepreneurship, arts and professional pathways.',
    enrollment: 'Explore enrollment pathways',
    contact: 'Discuss Paris community support',
    overview: 'View all AI High School locations',
    focusTitle: 'Proposed learning model',
    focuses: [
      ['AI, Mathematics & Robotics', 'Project-based mathematics, Python, machine learning, computer vision, automation and robotics with measurable student work.'],
      ['Cloud, Networks & Cybersecurity', 'Secure computing foundations, networks, cloud architecture, privacy, identity and resilient digital infrastructure.'],
      ['AI Arts, Film & Creative Technology', 'Responsible use of generative tools for visual arts, film, music, design, storytelling and portfolio production.'],
      ['Entrepreneurship & Industrial Revolution 4.0', 'Product development, financial literacy, innovation, intellectual property and career preparation for emerging industries.'],
      ['Bilingual & Global Pathways', 'French and English learning pathways designed to connect Paris students with international academic and professional opportunities.'],
      ['Professional Portfolio & Certification', 'Applied projects, portfolio evidence and Digital-UNI professional pathways developed with human review and clear credential boundaries.']
    ],
    communityTitle: 'Paris 8e community and facility initiative',
    communityText: 'Digital-UNI invites conversations with Paris families, educators, employers, technology partners and community stakeholders about developing this proposed lycée and adapting a suitable vacant or underused building for education, laboratories, creative studios and community programming.',
    siteTitle: 'Proposed building search — no site selected',
    siteText: 'No Paris property is represented as acquired, leased, reserved or approved. Any future site would require agreement with its owner and all applicable planning, education, safety, accessibility, financing and operating approvals.',
    statusTitle: 'Planning status',
    statusText: 'This is an independent Digital-UNI proposal. The Paris 8e AI Lycée is not currently open, and no school authorization, accreditation, public funding, facility approval or opening date is claimed. No affiliation or endorsement by the City of Paris, the French Ministry of National Education or another public or private institution is implied.'
  },
  fr: {
    title: 'Digital-UNI Lycée IA — Paris 8e arrondissement',
    eyebrow: 'Projet de Lycée IA · Paris 8e arrondissement',
    intro: 'Un concept Digital-UNI de lycée natif de l’IA dans le 8e arrondissement de Paris, associant enseignement secondaire exigeant, intelligence artificielle appliquée, robotique, entrepreneuriat, arts et parcours professionnels.',
    enrollment: 'Explorer les parcours d’inscription',
    contact: 'Soutenir le projet communautaire à Paris',
    overview: 'Voir tous les lycées IA',
    focusTitle: 'Modèle pédagogique proposé',
    focuses: [
      ['IA, mathématiques et robotique', 'Mathématiques par projets, Python, apprentissage automatique, vision par ordinateur, automatisation et robotique avec productions mesurables.'],
      ['Cloud, réseaux et cybersécurité', 'Fondamentaux de l’informatique sécurisée, réseaux, architecture cloud, confidentialité, identité et infrastructures numériques résilientes.'],
      ['Arts IA, cinéma et technologies créatives', 'Usage responsable des outils génératifs pour les arts visuels, le cinéma, la musique, le design, l’écriture et les portfolios.'],
      ['Entrepreneuriat et Industrie 4.0', 'Développement de produits, culture financière, innovation, propriété intellectuelle et préparation aux métiers émergents.'],
      ['Parcours bilingues et internationaux', 'Parcours en français et en anglais pour relier les élèves de Paris aux opportunités académiques et professionnelles internationales.'],
      ['Portfolio professionnel et certification', 'Projets appliqués, preuves de compétences et parcours professionnels Digital-UNI avec validation humaine et limites claires des titres délivrés.']
    ],
    communityTitle: 'Initiative communautaire et immobilière — Paris 8e',
    communityText: 'Digital-UNI souhaite dialoguer avec les familles, éducateurs, employeurs, partenaires technologiques et acteurs locaux afin de développer ce projet de lycée et d’étudier l’adaptation d’un bâtiment vacant ou sous-utilisé approprié pour l’enseignement, les laboratoires, les studios créatifs et les activités communautaires.',
    siteTitle: 'Recherche d’un bâtiment — aucun site sélectionné',
    siteText: 'Aucun bien immobilier parisien n’est présenté comme acquis, loué, réservé ou approuvé. Tout futur site nécessitera l’accord du propriétaire ainsi que les autorisations applicables en matière d’urbanisme, d’éducation, de sécurité, d’accessibilité, de financement et d’exploitation.',
    statusTitle: 'État du projet',
    statusText: 'Il s’agit d’une proposition indépendante de Digital-UNI. Le Lycée IA Paris 8e n’est pas actuellement ouvert et aucune autorisation scolaire, accréditation, subvention publique, approbation de site ou date d’ouverture n’est revendiquée. Aucune affiliation ni approbation de la Ville de Paris, du ministère français de l’Éducation nationale ou d’une autre institution publique ou privée n’est sous-entendue.'
  },
  ar: {
    title: 'Digital-UNI ثانوية الذكاء الاصطناعي — باريس 8',
    eyebrow: 'مبادرة مقترحة لثانوية الذكاء الاصطناعي · باريس 8',
    intro: 'تصور من Digital-UNI لثانوية حديثة في الدائرة الثامنة بباريس تجمع التعليم الثانوي القوي والذكاء الاصطناعي التطبيقي والروبوتات وريادة الأعمال والفنون والمسارات المهنية.',
    enrollment: 'استكشاف مسارات التسجيل',
    contact: 'مناقشة دعم مجتمع باريس',
    overview: 'عرض جميع مواقع الثانويات',
    focusTitle: 'النموذج التعليمي المقترح',
    focuses: [
      ['الذكاء الاصطناعي والرياضيات والروبوتات', 'رياضيات قائمة على المشاريع وPython والتعلم الآلي والرؤية الحاسوبية والأتمتة والروبوتات مع أعمال طلابية قابلة للتقييم.'],
      ['السحابة والشبكات والأمن السيبراني', 'أسس الحوسبة الآمنة والشبكات وبنية السحابة والخصوصية والهوية والبنية الرقمية المرنة.'],
      ['فنون الذكاء الاصطناعي والسينما والتقنيات الإبداعية', 'استخدام مسؤول للأدوات التوليدية في الفنون والسينما والموسيقى والتصميم والسرد وبناء ملف الأعمال.'],
      ['ريادة الأعمال والثورة الصناعية الرابعة', 'تطوير المنتجات والثقافة المالية والابتكار والملكية الفكرية والاستعداد لمهن المستقبل.'],
      ['مسارات ثنائية اللغة وعالمية', 'مسارات بالفرنسية والإنجليزية لربط طلاب باريس بفرص أكاديمية ومهنية دولية.'],
      ['ملف مهني وشهادات Digital-UNI', 'مشاريع تطبيقية وأدلة مهارية ومسارات مهنية مع مراجعة بشرية وحدود واضحة لنطاق الشهادة.']
    ],
    communityTitle: 'مبادرة مجتمع ومبنى باريس 8',
    communityText: 'تدعو Digital-UNI الأسر والمعلمين وأصحاب العمل وشركاء التكنولوجيا والجهات المجتمعية في باريس إلى مناقشة تطوير هذه الثانوية المقترحة ودراسة تهيئة مبنى مناسب شاغر أو قليل الاستخدام للتعليم والمختبرات والاستوديوهات والبرامج المجتمعية.',
    siteTitle: 'البحث عن مبنى مقترح — لم يتم اختيار موقع',
    siteText: 'لا تدعي Digital-UNI أن أي عقار في باريس تم شراؤه أو استئجاره أو حجزه أو اعتماده. أي موقع مستقبلي سيخضع لموافقة المالك وجميع متطلبات التخطيط والتعليم والسلامة وإمكانية الوصول والتمويل والتشغيل.',
    statusTitle: 'حالة المشروع',
    statusText: 'هذا اقتراح مستقل من Digital-UNI. ثانوية باريس 8 للذكاء الاصطناعي ليست مفتوحة حاليا، ولا ندعي وجود ترخيص مدرسي أو اعتماد أو تمويل عام أو موافقة على مبنى أو تاريخ افتتاح. ولا يُفهم منه أي انتساب أو تأييد من مدينة باريس أو وزارة التربية الوطنية الفرنسية أو أي مؤسسة عامة أو خاصة أخرى.'
  }
} as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) notFound();
  const c = copy[params.locale as Locale];
  return { title: c.title, description: c.intro };
}

export default function ParisAiLyceePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy-900 px-4 py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(47,182,168,.28),transparent_30%),radial-gradient(circle_at_18%_88%,rgba(217,181,89,.2),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-gold-400">{c.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight md:text-7xl">{c.title}</h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-navy-50 md:text-xl">{c.intro}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={`/${locale}/enrollment`} className="rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900 hover:bg-gold-400">{c.enrollment}</Link>
              <Link href={`/${locale}/contact`} className="rounded-xl border border-highlight-turquoise/60 bg-highlight-turquoise/10 px-6 py-3.5 font-black text-highlight-turquoise hover:bg-highlight-turquoise/20">{c.contact}</Link>
              <Link href={`/${locale}/ai-high-school#campus-selector`} className="rounded-xl border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10">{c.overview}</Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[280px] rounded-3xl border border-gold-400/40 bg-black/35 p-5 text-center shadow-2xl">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-black">
              <Image src="/images/digital-uni-ai-pioneers-shark-logo.png" alt="Digital-UNI AI Pioneers Sharks logo — Lycée-Paris 8" fill sizes="280px" className="object-contain" />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-highlight-turquoise">Digital-UNI AI Pioneers Sharks</p>
            <p className="mt-2 text-2xl font-black text-gold-400">Lycée-Paris 8</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-navy-900 md:text-5xl">{c.focusTitle}</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.focuses.map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                <span className="text-sm font-black text-gold-600">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-bold text-navy-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-navy-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-highlight-turquoise">Paris 8 · Community</p>
            <h2 className="mt-3 text-3xl font-black text-navy-900">{c.communityTitle}</h2>
            <p className="mt-5 leading-8 text-navy-600">{c.communityText}</p>
          </article>
          <article className="rounded-3xl border border-gold-400/50 bg-gold-200/30 p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-600">Facility concept</p>
            <h2 className="mt-3 text-3xl font-black text-navy-900">{c.siteTitle}</h2>
            <p className="mt-5 leading-8 text-navy-600">{c.siteText}</p>
          </article>
        </div>
      </section>

      <section className="bg-navy-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/15 bg-white/[0.06] p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-400">Digital-UNI · Lycée-Paris 8</p>
          <h2 className="mt-3 text-3xl font-black">{c.statusTitle}</h2>
          <p className="mt-5 max-w-5xl leading-8 text-navy-50/85">{c.statusText}</p>
        </div>
      </section>
    </main>
  );
}