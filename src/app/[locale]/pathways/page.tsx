import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

type Pathway = {
  title: string;
  outcome: string;
  lessons: string[];
  project: string;
  interview: string;
  references: { provider: string; label: string; href: string }[];
};

const copy = {
  en: {
    eyebrow: 'Digital-UNI original programs', title: 'Learning pathways built for applied work and interviews',
    intro: 'Each pathway combines focused Digital-UNI instruction, practical assignments, a portfolio capstone, interview preparation, and carefully selected official reference material.',
    reviewed: 'Catalog reviewed September 2026', curriculum: 'Digital-UNI curriculum', project: 'Applied capstone', interview: 'Interview preparation', references: 'Official supplemental references',
    referenceNote: 'These links broaden preparation; they are not Digital-UNI lessons and do not create a partnership or transfer an external credential.',
    certificationTitle: 'How Digital-UNI certification works',
    certificationText: 'A Digital-UNI certificate is awarded only after the learner completes the Digital-UNI lessons, required assignments, capstone, and final assessment. External exams, badges, certificates, licenses, and university credit remain separate and are issued only by the named provider.',
    disclosure: 'Digital-UNI independently develops and delivers its educational programs and certification assessments. References to external institutions, companies, publications, and publicly available materials are provided for supplemental educational purposes only and do not imply sponsorship, endorsement, affiliation, accreditation, or joint certification.',
    enroll: 'Plan my pathway', certifications: 'Certification preparation', pathway: 'Pathway'
  },
  fr: {
    eyebrow: 'Programmes originaux Digital-UNI', title: 'Des parcours conçus pour la pratique et les entretiens',
    intro: 'Chaque parcours associe les cours Digital-UNI, des travaux pratiques, un projet de portfolio, la préparation aux entretiens et des références officielles soigneusement sélectionnées.',
    reviewed: 'Catalogue vérifié en septembre 2026', curriculum: 'Programme Digital-UNI', project: 'Projet appliqué', interview: 'Préparation aux entretiens', references: 'Références officielles complémentaires',
    referenceNote: 'Ces liens complètent la préparation; ils ne sont pas des cours Digital-UNI et ne créent ni partenariat ni transfert de diplôme externe.',
    certificationTitle: 'Fonctionnement de la certification Digital-UNI',
    certificationText: 'Un certificat Digital-UNI est délivré uniquement après les cours, travaux, projet final et évaluation Digital-UNI requis. Les examens, badges, certificats, licences et crédits universitaires externes restent distincts et sont délivrés uniquement par le fournisseur nommé.',
    disclosure: 'Digital-UNI développe et dispense indépendamment ses programmes et ses évaluations de certification. Les références externes sont fournies uniquement à titre pédagogique et n’impliquent aucun parrainage, aval, affiliation, accréditation ou certification conjointe.',
    enroll: 'Planifier mon parcours', certifications: 'Préparation aux certifications', pathway: 'Parcours'
  },
  ar: {
    eyebrow: 'برامج Digital-UNI الأصلية', title: 'مسارات تعليمية للعمل التطبيقي والاستعداد للمقابلات',
    intro: 'يجمع كل مسار بين تعليم Digital-UNI والواجبات العملية ومشروع مهني والاستعداد للمقابلات ومراجع رسمية منتقاة بعناية.',
    reviewed: 'تمت مراجعة الدليل في سبتمبر 2026', curriculum: 'منهج Digital-UNI', project: 'المشروع التطبيقي', interview: 'الاستعداد للمقابلات', references: 'مراجع رسمية إضافية',
    referenceNote: 'توسع هذه الروابط نطاق الاستعداد؛ وهي ليست دروسًا من Digital-UNI ولا تنشئ شراكة أو تنقل اعتمادًا خارجيًا.',
    certificationTitle: 'كيفية الحصول على شهادة Digital-UNI',
    certificationText: 'تُمنح شهادة Digital-UNI فقط بعد إكمال دروس Digital-UNI والواجبات المطلوبة والمشروع النهائي والتقييم. وتظل الشهادات والتراخيص والاعتمادات الجامعية الخارجية منفصلة ولا يصدرها إلا المزود المذكور.',
    disclosure: 'تطور Digital-UNI برامجها التعليمية وتقييمات شهاداتها وتقدمها بصورة مستقلة. وترد المراجع الخارجية لأغراض تعليمية تكميلية فقط، ولا تعني رعاية أو تأييدًا أو انتسابًا أو اعتمادًا أو شهادة مشتركة.',
    enroll: 'خطط لمساري', certifications: 'الاستعداد للشهادات', pathway: 'المسار'
  }
} as const;

const pathways: Pathway[] = [
  {
    title: 'AI, Machine Learning & Data Science',
    outcome: 'Build, evaluate, explain, and deploy a data-driven model with reproducible evidence.',
    lessons: ['Python, NumPy, Pandas, SQL, and data quality', 'Exploratory analysis, visualization, and statistical reasoning', 'Regression, classification, clustering, and model selection', 'Neural networks, TensorFlow/Keras, computer vision, and NLP', 'Deployment, monitoring, drift, documentation, and responsible AI'],
    project: 'An end-to-end model, model card, evaluation report, and live demonstration.',
    interview: 'Coding, statistics, feature design, experiment review, and ML system design.',
    references: [
      { provider: 'Google', label: 'Machine Learning Crash Course', href: 'https://developers.google.com/machine-learning/crash-course' },
      { provider: 'NIST', label: 'AI Risk Management Framework', href: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { provider: 'Python', label: 'Python tutorial', href: 'https://docs.python.org/3/tutorial/' }
    ]
  },
  {
    title: 'Generative AI, RAG & AI Agents',
    outcome: 'Design a reliable tool-using assistant with retrieval, evaluations, safety controls, and human approval.',
    lessons: ['Foundation models, context, embeddings, and multimodal inputs', 'Prompt design, structured output, retrieval, citations, and grounding', 'Tools, agent loops, state, memory boundaries, and interoperability', 'Evaluations, red teaming, guardrails, privacy, latency, and cost', 'Production observability, human escalation, and failure recovery'],
    project: 'A grounded multilingual assistant with a test set, evaluation results, audit trail, and human-review checkpoints.',
    interview: 'RAG design, hallucination analysis, tool security, prompt injection, and evaluation strategy.',
    references: [
      { provider: 'OpenAI', label: 'Agents guide', href: 'https://developers.openai.com/api/docs/guides/agents' },
      { provider: 'OpenAI', label: 'Evaluation best practices', href: 'https://developers.openai.com/api/docs/guides/evaluation-best-practices' },
      { provider: 'NIST', label: 'Generative AI Profile', href: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence' }
    ]
  },
  {
    title: 'Cybersecurity & Cloud Security',
    outcome: 'Defend a cloud-connected environment and communicate risk, evidence, and response decisions.',
    lessons: ['Networking, Linux, identity, access, cryptography, and secure configuration', 'Threat modeling, vulnerability management, and zero-trust principles', 'Cloud responsibility, secrets, logging, containers, and infrastructure as code', 'SOC triage, detection engineering, incident response, and recovery', 'Secure AI systems, supply-chain risk, and post-quantum migration awareness'],
    project: 'A cloud threat model, hardened reference deployment, detection lab, and incident report.',
    interview: 'Log investigation, IAM design, incident scenarios, architecture review, and risk prioritization.',
    references: [
      { provider: 'NIST', label: 'Cybersecurity Framework 2.0', href: 'https://www.nist.gov/cyberframework' },
      { provider: 'CISA', label: 'Cloud Security Reference Architecture', href: 'https://www.cisa.gov/resources-tools/resources/cloud-security-technical-reference-architecture' },
      { provider: 'OWASP', label: 'OWASP Top 10', href: 'https://owasp.org/www-project-top-ten/' }
    ]
  },
  {
    title: 'Cloud Computing, DevOps & Programming',
    outcome: 'Ship a secure, observable application through a repeatable development and deployment pipeline.',
    lessons: ['Python, TypeScript, APIs, testing, Git, and code review', 'Linux, networking, containers, orchestration, and infrastructure as code', 'Cloud architecture, serverless functions, storage, queues, and resiliency', 'CI/CD, secrets, software supply-chain controls, and rollback', 'Metrics, logs, traces, performance, cost, and reliability engineering'],
    project: 'A tested application deployed through CI/CD with monitoring, security checks, and rollback documentation.',
    interview: 'API design, debugging, distributed systems, reliability, and architecture trade-offs.',
    references: [
      { provider: 'AWS', label: 'Well-Architected Framework', href: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
      { provider: 'Google Cloud', label: 'Cloud Architecture Framework', href: 'https://cloud.google.com/architecture/framework' },
      { provider: 'Kubernetes', label: 'Kubernetes documentation', href: 'https://kubernetes.io/docs/home/' }
    ]
  },
  {
    title: 'Blockchain, Smart Contracts & Digital Assets',
    outcome: 'Evaluate when a distributed ledger is appropriate and build a secure, testable prototype.',
    lessons: ['Distributed systems, consensus, cryptographic hashes, keys, and wallets', 'Ledger architectures, transactions, tokens, and custody models', 'Smart-contract design, testing, upgrade risk, and common exploits', 'Privacy, interoperability, governance, compliance, and operational risk', 'Digital-asset economics, market structure, evidence, and responsible claims'],
    project: 'A test-network application with threat model, contract tests, governance plan, and user-risk disclosure.',
    interview: 'Consensus trade-offs, key management, contract vulnerabilities, scalability, and custody.',
    references: [
      { provider: 'Ethereum', label: 'Developer documentation', href: 'https://ethereum.org/en/developers/docs/' },
      { provider: 'Hyperledger', label: 'Fabric documentation', href: 'https://hyperledger-fabric.readthedocs.io/' },
      { provider: 'NIST', label: 'Blockchain Technology Overview', href: 'https://www.nist.gov/publications/blockchain-technology-overview' }
    ]
  },
  {
    title: 'Executive AI Leadership & Governance',
    outcome: 'Lead an AI portfolio with measurable value, governance, workforce planning, and accountable risk decisions.',
    lessons: ['AI opportunity discovery and business-case validation', 'Data, talent, operating model, procurement, and build-versus-buy decisions', 'Portfolio governance, risk ownership, human oversight, and responsible use', 'Cybersecurity, privacy, intellectual property, vendor, and regulatory diligence', 'Adoption metrics, financial controls, incident readiness, and board reporting'],
    project: 'An executive AI strategy, investment roadmap, governance charter, KPI dashboard, and board briefing.',
    interview: 'CEO/CTO/CIO/COO cases covering value, governance, transformation, procurement, and crisis response.',
    references: [
      { provider: 'NIST', label: 'AI Risk Management Framework', href: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { provider: 'OECD', label: 'AI Principles', href: 'https://oecd.ai/en/ai-principles' },
      { provider: 'ISO', label: 'ISO/IEC 42001 overview', href: 'https://www.iso.org/standard/81230.html' }
    ]
  },
  {
    title: 'AI Corporate Financial Audit & M&A',
    outcome: 'Use AI-supported analysis to strengthen diligence while preserving evidence, controls, and professional judgment.',
    lessons: ['Financial statements, valuation drivers, data lineage, and reconciliation', 'Anomaly detection, document extraction, and reproducible analysis', 'M&A screening, quality of earnings, scenarios, and integration risk', 'Model validation, access control, audit trails, confidentiality, and human sign-off', 'Reporting assumptions, limitations, exceptions, and unresolved evidence'],
    project: 'A controlled diligence analysis with valuation scenarios, evidence register, and review memorandum.',
    interview: 'Financial modeling, control testing, anomalies, deal risks, explainability, and escalation decisions.',
    references: [
      { provider: 'SEC', label: 'EDGAR company filings', href: 'https://www.sec.gov/edgar/search-and-access' },
      { provider: 'PCAOB', label: 'Auditing standards', href: 'https://pcaobus.org/oversight/standards/auditing-standards' },
      { provider: 'NIST', label: 'AI Risk Management Framework', href: 'https://www.nist.gov/itl/ai-risk-management-framework' }
    ]
  },
  {
    title: 'AI for Lawyers, Courts & Legal Operations',
    outcome: 'Use AI decision-support tools with confidentiality, verification, jurisdiction awareness, and human responsibility.',
    lessons: ['Legal research, source verification, citations, and document provenance', 'Contract and litigation analysis with privilege and confidentiality controls', 'Court operations, clerk assistance, service data, and jurisdictional checks', 'Bias, due process, explainability, record preservation, and judicial independence', 'Human review, professional responsibility, procurement, and validation'],
    project: 'A legal decision-support prototype with verified sources, a risk register, access controls, and human-review protocol.',
    interview: 'Citation verification, confidentiality, practice boundaries, bias, evidence, and failed-model scenarios.',
    references: [
      { provider: 'NIST', label: 'AI Risk Management Framework', href: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { provider: 'U.S. Courts', label: 'Educational resources', href: 'https://www.uscourts.gov/about-federal-courts/educational-resources' },
      { provider: 'Cornell LII', label: 'Legal Information Institute', href: 'https://www.law.cornell.edu/' }
    ]
  }
];

export default function PathwaysPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = copy[locale];

  return (
    <main className="bg-[#f5f7fa]">
      <section className="bg-navy-900 px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[.25em] text-gold-400">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-navy-100">{t.intro}</p>
          <p className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold">{t.reviewed}</p>
        </div>
      </section>

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-7xl space-y-8">
          {pathways.map((item, index) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
              <div className="grid lg:grid-cols-[.38fr_.62fr]">
                <div className="bg-navy-900 p-7 text-white md:p-9">
                  <p className="text-xs font-black uppercase tracking-[.2em] text-gold-400">{t.pathway} {String(index + 1).padStart(2, '0')}</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight">{item.title}</h2>
                  <p className="mt-5 leading-7 text-navy-100">{item.outcome}</p>
                  <Link href={`/${locale}/enrollment`} className="mt-8 inline-flex rounded-xl bg-gold-500 px-5 py-3 font-black text-navy-900 hover:bg-gold-400">{t.enroll}</Link>
                </div>
                <div className="p-7 md:p-9">
                  <h3 className="text-sm font-black uppercase tracking-[.18em] text-emerald-700">{t.curriculum}</h3>
                  <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                    {item.lessons.map((lesson, lessonIndex) => <li key={lesson} className="flex gap-3 rounded-xl bg-navy-50 p-4 text-sm leading-6 text-navy-700"><span className="font-black text-highlight-electric">{lessonIndex + 1}</span><span>{lesson}</span></li>)}
                  </ol>
                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    <div><h3 className="font-black text-navy-900">{t.project}</h3><p className="mt-2 text-sm leading-6 text-navy-600">{item.project}</p></div>
                    <div><h3 className="font-black text-navy-900">{t.interview}</h3><p className="mt-2 text-sm leading-6 text-navy-600">{item.interview}</p></div>
                  </div>
                  <div className="mt-7 border-t border-navy-100 pt-6">
                    <h3 className="font-black text-navy-900">{t.references}</h3>
                    <p className="mt-2 text-xs leading-5 text-navy-500">{t.referenceNote}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.references.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-navy-200 px-4 py-2 text-xs font-bold text-highlight-electric hover:bg-navy-50">{reference.provider}: {reference.label} ↗</a></li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-gold-400/40 bg-gold-200/30 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-navy-900">{t.certificationTitle}</h2>
          <p className="mt-4 max-w-5xl leading-7 text-navy-700">{t.certificationText}</p>
          <p className="mt-5 max-w-5xl text-sm font-semibold leading-6 text-navy-700">{t.disclosure}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${locale}/enrollment`} className="rounded-xl bg-navy-900 px-5 py-3 font-black text-white">{t.enroll}</Link>
            <Link href={`/${locale}/certifications`} className="rounded-xl border border-navy-300 bg-white px-5 py-3 font-black text-navy-900">{t.certifications}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
