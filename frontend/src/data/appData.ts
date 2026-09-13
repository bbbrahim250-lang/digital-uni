// Static data model for Digital-UNI AI Train — matches Section 3 of the blueprint.

export type Station = { name: string; description: string; price: number };
export type Track = { id: string; name: string; tag: string; icon: string; stations: Station[] };

export const TRACKS: Track[] = [
  {
    id: "aiml",
    name: "AI & Machine Learning",
    tag: "6 stations",
    icon: "hardware-chip",
    stations: [
      { name: "AI + ML", description: "Foundations of artificial intelligence and machine learning", price: 250 },
      { name: "Vision + CNN", description: "Computer vision and convolutional neural networks", price: 300 },
      { name: "TensorFlow", description: "Building and training models with TensorFlow", price: 300 },
      { name: "EDA + K-Means", description: "Exploratory data analysis and clustering", price: 250 },
      { name: "Regression", description: "Predictive modeling with regression techniques", price: 250 },
      { name: "Pandas + NumPy", description: "Core Python data tools for AI work", price: 200 },
    ],
  },
  {
    id: "cyber",
    name: "Cybersecurity & Blockchain",
    tag: "3 stations",
    icon: "shield-checkmark",
    stations: [
      { name: "Cybersecurity", description: "Defending systems, networks, and data", price: 350 },
      { name: "Blockchain", description: "Distributed ledgers and smart contracts", price: 400 },
      { name: "Cloud + Data", description: "Cloud infrastructure and data pipelines", price: 300 },
    ],
  },
  {
    id: "exec",
    name: "Executive Leadership",
    tag: "1 station",
    icon: "briefcase",
    stations: [
      { name: "Executive", description: "CEO, CTO, CIO, and COO programs, including AI financial audit and M&A analysis", price: 25000 },
    ],
  },
  {
    id: "crypto",
    name: "AI Crypto-Economics & NESU Research",
    tag: "PhD / Postdoctoral · 4 stations",
    icon: "logo-bitcoin",
    stations: [
      { name: "Sovereign Digital Currency Design", description: "Asset-backed, permissioned settlement units for nation-to-nation trade", price: 1200 },
      { name: "Zero-Interest Macro-Sovereign Model", description: "Separating service/infrastructure fees from zero-interest capital repayment", price: 1200 },
      { name: "Corridor Tokens & Cross-Border Settlement", description: "Institution-only settlement corridors between trading nations", price: 1500 },
      { name: "Climate-Indexed Risk Modeling", description: "Geographic climate-risk scoring applied to sovereign trade settlement", price: 1500 },
    ],
  },
  {
    id: "judge",
    name: "AI Judge Pathway",
    tag: "Legal AI · 4 stations",
    icon: "hammer",
    stations: [
      { name: "Judicial AI Foundations", description: "How AI research tools fit into judicial workflow and ethics rules", price: 350 },
      { name: "Precedent & Opinion Analysis AI", description: "Using AI to surface controlling precedent from public court records", price: 400 },
      { name: "Ruling Pattern Research", description: "AI-assisted review of a court's own published rulings for consistency", price: 400 },
      { name: "AI Ethics on the Bench", description: "Disclosure, bias, and reliability standards for AI-assisted judicial research", price: 350 },
    ],
  },
  {
    id: "lawyer",
    name: "AI Lawyer Pathway",
    tag: "Legal AI · 4 stations",
    icon: "scale",
    stations: [
      { name: "Legal AI Foundations", description: "Core AI research and drafting tools for practicing attorneys", price: 300 },
      { name: "Case & Precedent Research AI", description: "AI-assisted case law and precedent research workflows", price: 400 },
      { name: "Contract & Document Analysis AI", description: "AI review of contracts, filings, and discovery documents", price: 400 },
      { name: "Client Case Evaluation AI", description: "Structuring case strategy and client intake with AI support", price: 350 },
    ],
  },
  {
    id: "clerk",
    name: "AI Clerk Pathway",
    tag: "Legal AI · 3 stations",
    icon: "document-text",
    stations: [
      { name: "Court AI Clerk Foundations", description: "AI-assisted docket intake and document organization basics", price: 250 },
      { name: "Filing & Exhibit Tracking AI", description: "Automated tracking of proof of service, statements, and exhibits", price: 300 },
      { name: "Case Management Systems AI", description: "AI tools for scheduling, status tracking, and court communications", price: 300 },
    ],
  },
];

export type Program = { id: string; name: string; subtitle: string; audience: string };
export const PROGRAMS: Program[] = [
  { id: "prof", name: "Professional Certification", subtitle: "12 weeks · $3,000", audience: "For college students" },
  { id: "exec", name: "Executive Program", subtitle: "6 weeks · $25,000", audience: "For working executives & leaders" },
];

export const CREDENTIALS = [
  { id: "DU-DIP-10234", title: "AI High School Diploma" },
  { id: "DU-CERT-88213", title: "Professional Certification" },
  { id: "DU-CERT-52091", title: "Executive Professional Certification" },
  { id: "DU-CERT-63407", title: "AI Legal Certification" },
];

export type StoreItem = {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  category: "exploratory" | "event" | "fund-ailab" | "fund-aihs" | "apparel";
  event?: string;
};

export const STORE_EXPLORATORY: StoreItem[] = [
  { id: "explore-student", name: "Student Exploratory Ticket", subtitle: "For an eligible student attending one approved session.", price: 15, category: "exploratory" },
  { id: "explore-staff", name: "Staff Exploratory Ticket", subtitle: "For eligible school or Digital-UNI staff.", price: 25, category: "exploratory" },
];

export type EventDef = {
  id: string;
  title: string;
  subtitle: string;
  where: string;
  tiers: { key: string; label: string; price: number }[];
};

export const STORE_EVENTS: EventDef[] = [
  {
    id: "halloween",
    title: "Halloween Gala — DON'T ASK DON'T TELL (Midnight Exorcism)",
    subtitle: "A French Kiss at Midnight",
    where: "Oct 31, 2026 · Digital-UNI Auditorium, Paris",
    tiers: [
      { key: "admit", label: "Admit One", price: 125 },
      { key: "vip", label: "VIP", price: 500 },
      { key: "premiere", label: "Premiere", price: 2000 },
    ],
  },
  {
    id: "thanksgiving",
    title: "Thanksgiving Concert",
    subtitle: "An Evening of Music & Thanks",
    where: "Nov 26, 2026 · Santa Monica",
    tiers: [
      { key: "admit", label: "Admit One", price: 75 },
      { key: "vip", label: "VIP", price: 250 },
      { key: "premiere", label: "Premiere", price: 750 },
    ],
  },
  {
    id: "holiday",
    title: "Holiday Concert",
    subtitle: "Season Celebration",
    where: "Dec 2026",
    tiers: [
      { key: "admit", label: "Admit One", price: 100 },
      { key: "vip", label: "VIP", price: 350 },
      { key: "premiere", label: "Premiere", price: 1000 },
    ],
  },
  {
    id: "ailab-showcase",
    title: "AI Lab Research Showcase",
    subtitle: "Public research showcase",
    where: "Digital-UNI Campus",
    tiers: [{ key: "single", label: "Admit One", price: 40 }],
  },
  {
    id: "openhouse",
    title: "AI High School Open House",
    subtitle: "Tour our campuses",
    where: "Santa Monica-Malibu / Palo Alto-Redwood City",
    tiers: [{ key: "single", label: "Admit One", price: 10 }],
  },
  {
    id: "games",
    title: "AI High School Streaming Games",
    subtitle: "Live Sharks streaming access",
    where: "Online",
    tiers: [{ key: "single", label: "Admit One", price: 12 }],
  },
];

export const FUND_TIERS = [100, 1000, 10000, 100000, 1000000];

export const APPAREL_ITEMS = [
  { key: "shirt", name: "AI Pioneers Sharks — Men's Football Shirt", price: 35 },
  { key: "cap", name: "AI Pioneers Sharks Team Cap", price: 15 },
  { key: "mug", name: "AI Pioneers Sharks Coffee Mug", price: 5 },
];

export const BTC_RATE_USD = 77800;
export const BTC_AS_OF = "Sep 2026";

// Sample AI+ML course quiz
export const AIML_QUIZ = [
  {
    q: 'What does "AI" stand for?',
    opts: ["Artificial Intelligence", "Automated Interface", "Applied Informatics"],
    correct: 0,
  },
  {
    q: "Which of these is a core building block of machine learning models?",
    opts: ["Firewalls", "Neural Networks", "Spreadsheets"],
    correct: 1,
  },
  {
    q: "What is the goal of training a machine learning model?",
    opts: [
      "To memorize the exact training data",
      "To increase the file size",
      "To learn patterns that generalize to new data",
    ],
    correct: 2,
  },
  {
    q: "Machine learning models typically learn by:",
    opts: [
      'Studying labeled examples ("training data")',
      "Guessing randomly forever",
      "Reading a rulebook written by humans",
    ],
    correct: 0,
  },
  {
    q: "Which of these is a real-world example of AI in everyday use?",
    opts: ["A mechanical pencil", "A voice assistant like Siri or Alexa", "A paper map"],
    correct: 1,
  },
];

// Tutor quiz — C++ vs Python
export const TUTOR_QUIZ = [
  {
    q: "Which language is known for simple, beginner-friendly syntax?",
    opts: ["Python", "C++", "Both equally"],
    correct: 0,
  },
  {
    q: "Which language requires you to declare variable types (e.g. int x = 5;)?",
    opts: ["Python", "C++", "Neither"],
    correct: 1,
  },
  {
    q: "Which language is commonly used for fast game engines and system-level code?",
    opts: ["Python", "C++", "HTML"],
    correct: 1,
  },
  {
    q: "Which language is popular for AI, data science, and quick scripting?",
    opts: ["C++", "Python", "CSS"],
    correct: 1,
  },
  {
    q: 'In Python, how do you print "Hello World" to the screen?',
    opts: ['print("Hello World")', 'cout << "Hello World";', 'System.out.println("Hello World")'],
    correct: 0,
  },
];

export const AI_LAB_STAGES = [
  { title: "Idea", desc: "Start with a real problem you want to solve." },
  { title: "AI Workflow", desc: "Design how AI does the work." },
  { title: "Prototype", desc: "Build a working version." },
  { title: "Testing", desc: "Verify it actually works." },
  { title: "Publication", desc: "Publish inside the Digital-UNI ecosystem." },
  { title: "Commercialization", desc: "Earn revenue from real users." },
];

export const FLAGSHIP_APPS = [
  { name: "AI Judge App", desc: "AI-assisted precedent research and ruling-pattern analysis for the bench.", from: "AI Judge Pathway" },
  { name: "AI Lawyer App", desc: "AI-assisted case research, contract analysis, and case evaluation.", from: "AI Lawyer Pathway" },
  { name: "AI Clerk App", desc: "AI-assisted docket intake, filing, and case-management tracking.", from: "AI Clerk Pathway" },
  { name: "Legal AI — Corporate M&A", desc: "AI-assisted financial due diligence and M&A analysis for corporate legal teams.", from: "Executive Leadership" },
];

export const IMAGES = {
  hero: "https://customer-assets-lqy194kg.emergentagent.net/job_learn-build-belong/artifacts/fd83meob_ai-train-stations.jpg",
  stations: "https://customer-assets-lqy194kg.emergentagent.net/job_learn-build-belong/artifacts/fd83meob_ai-train-stations.jpg",
  founder: "https://customer-assets-lqy194kg.emergentagent.net/job_learn-build-belong/artifacts/shuvqpem_founder-card.jpg",
  lab: "https://images.unsplash.com/photo-1737703218497-64e00b39638f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwbGFib3JhdG9yeSUyMGRhcmslMjBuZW9uJTIwZ3JlZW58ZW58MHx8fHwxNzg5MjU3NTMwfDA&ixlib=rb-4.1.0&q=85",
  gold: "https://customer-assets-lqy194kg.emergentagent.net/job_learn-build-belong/artifacts/fd83meob_ai-train-stations.jpg",
  campus: "https://customer-assets-lqy194kg.emergentagent.net/job_learn-build-belong/artifacts/shuvqpem_founder-card.jpg",
};

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export const VIDEOS = {
  hero: `${BACKEND_URL}/api/media/hero-train.mp4`,
  course: `${BACKEND_URL}/api/media/course-video.mp4`,
};
