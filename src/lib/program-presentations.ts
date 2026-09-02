import type { PathwayTrack } from './applicant-planning';

export type ProgramPresentation = {
  title: string;
  shortTitle: string;
  track: PathwayTrack;
  category: string;
  promise: string;
  audience: string;
  outcome: string;
  image: string;
  featured?: boolean;
};

export const programPresentations: ProgramPresentation[] = [
  {
    title: 'AI and Machine Learning', shortTitle: 'AI & Machine Learning', track: 'professional', category: 'Applied AI',
    promise: 'Build practical AI systems, from data preparation to evaluated models and deployment-ready prototypes.',
    audience: 'Developers, analysts, technical career changers', outcome: 'An applied AI portfolio project and counselor-reviewed professional pathway',
    image: '/images/programs/applied-ai.svg', featured: true
  },
  {
    title: 'Data Science and Visualization', shortTitle: 'Data Science & Visualization', track: 'professional', category: 'Data & Decisions',
    promise: 'Turn complex datasets into defensible analysis, executive dashboards, and decisions people can act on.',
    audience: 'Analysts, operators, researchers, managers', outcome: 'A decision-ready data story and reproducible analysis portfolio',
    image: '/images/programs/data-intelligence.svg', featured: true
  },
  {
    title: 'Cybersecurity and Cloud Security', shortTitle: 'Cybersecurity & Cloud', track: 'professional', category: 'Secure Systems',
    promise: 'Design modern cloud safeguards, threat-aware operations, and responsible security practices.',
    audience: 'IT professionals, cloud teams, security entrants', outcome: 'A cloud security assessment and response-plan portfolio',
    image: '/images/programs/secure-ai.svg', featured: true
  },
  {
    title: 'Computer Vision and CNN', shortTitle: 'Computer Vision & CNN', track: 'professional', category: 'AI Engineering',
    promise: 'Develop visual intelligence systems using modern neural-network workflows and responsible evaluation.',
    audience: 'Developers, engineers, applied researchers', outcome: 'A tested computer-vision prototype and technical implementation brief',
    image: '/images/programs/applied-ai.svg'
  },
  {
    title: 'TensorFlow / Keras / ANN', shortTitle: 'TensorFlow, Keras & ANN', track: 'professional', category: 'AI Engineering',
    promise: 'Move from neural-network concepts to working models, measurable experiments, and maintainable code.',
    audience: 'Developers, data practitioners, technical students', outcome: 'A documented neural-network experiment and model card',
    image: '/images/programs/applied-ai.svg'
  },
  {
    title: 'Blockchain and Digital Currency', shortTitle: 'Blockchain & Digital Currency', track: 'professional', category: 'Financial Technology',
    promise: 'Examine blockchain architecture, digital assets, controls, and real-world financial technology use cases.',
    audience: 'Finance, technology, compliance, and product professionals', outcome: 'A risk-aware digital-currency application proposal',
    image: '/images/programs/data-intelligence.svg'
  },
  {
    title: 'Executive AI Leadership: CEO, CTO, CIO, COO', shortTitle: 'Executive AI Strategy & Leadership', track: 'executive', category: 'Executive Leadership',
    promise: 'Translate AI opportunity into an enterprise roadmap with economics, governance, risk, and measurable priorities.',
    audience: 'CEOs, CTOs, CIOs, COOs, founders, senior leaders', outcome: 'An executive AI strategy and 90-day advisory roadmap',
    image: '/images/programs/executive-strategy.svg', featured: true
  },
  {
    title: 'AI Corporate Financial Audit', shortTitle: 'AI Corporate Financial Audit', track: 'executive', category: 'Finance & Governance',
    promise: 'Explore AI-assisted audit planning, evidence quality, controls, anomalies, and accountable human review.',
    audience: 'Finance leaders, auditors, controllers, risk teams', outcome: 'A governed AI-audit operating model and control map',
    image: '/images/programs/data-intelligence.svg', featured: true
  },
  {
    title: 'AI Mergers and Acquisitions', shortTitle: 'AI for Mergers & Acquisitions', track: 'executive', category: 'Strategy & Transactions',
    promise: 'Apply AI to transaction screening, diligence workflows, integration planning, and decision governance.',
    audience: 'Executives, corporate development, finance, advisors', outcome: 'A transaction-intelligence workflow and governance brief',
    image: '/images/programs/executive-strategy.svg', featured: true
  },
  {
    title: 'Digital-UNI™ Lawyer AI App', shortTitle: 'Lawyer AI Application', track: 'executive', category: 'Legal Technology',
    promise: 'Design educational legal-workflow decision support with human oversight, privacy, and clear limitations.',
    audience: 'Legal operations, technologists, policy and court professionals', outcome: 'A responsibly scoped legal-workflow application concept',
    image: '/images/programs/secure-ai.svg'
  },
  {
    title: 'Digital-UNI™ Judge AI App', shortTitle: 'Judicial AI Application', track: 'executive', category: 'Legal Technology',
    promise: 'Study transparent, human-controlled decision-support patterns for judicial research and administration.',
    audience: 'Court professionals, legal technologists, policy teams', outcome: 'A safeguards-first judicial support application blueprint',
    image: '/images/programs/secure-ai.svg'
  },
  {
    title: 'Digital-UNI™ Court AI Clerk Assistant', shortTitle: 'Court AI Clerk Assistant', track: 'executive', category: 'Court Operations',
    promise: 'Map high-volume court administration into auditable, privacy-conscious AI-assisted workflows.',
    audience: 'Court administration, legal operations, public-sector technology', outcome: 'A court-workflow prototype specification and risk register',
    image: '/images/programs/secure-ai.svg'
  },
  {
    title: 'Digital-UNI™ Court AI Expert', shortTitle: 'Court AI Expert', track: 'executive', category: 'Legal Technology',
    promise: 'Develop an expert-level framework for evaluating legal AI evidence, limits, and human accountability.',
    audience: 'Senior legal, court, policy, and technology professionals', outcome: 'An expert evaluation framework and implementation roadmap',
    image: '/images/programs/secure-ai.svg'
  },
  {
    title: 'Digital-UNI™ AI Agent for Proof-of-Service & Jurisdiction Compatibility', shortTitle: 'Proof-of-Service & Jurisdiction AI', track: 'executive', category: 'Legal Operations',
    promise: 'Model educational compatibility checks that surface questions and evidence for authorized human review.',
    audience: 'Legal operations, service professionals, court technologists', outcome: 'A human-reviewed rules and evidence workflow concept',
    image: '/images/programs/secure-ai.svg'
  }
];

export function getProgramPresentation(title: string) {
  return programPresentations.find(program => program.title === title) ?? programPresentations[0]!;
}
