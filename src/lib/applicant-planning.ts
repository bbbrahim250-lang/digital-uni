import { z } from 'zod';

export const programCatalog = {
  'AI and Machine Learning': 2400,
  'Computer Vision and CNN': 2600,
  'TensorFlow / Keras / ANN': 2500,
  'Data Science and Visualization': 2200,
  'Cybersecurity and Cloud Security': 2800,
  'Blockchain and Digital Currency': 2500,
  'Executive AI Leadership: CEO, CTO, CIO, COO': 3200,
  'AI Corporate Financial Audit': 3000,
  'AI Mergers and Acquisitions': 3200,
  'Digital-UNI™ Lawyer AI App': 3000,
  'Digital-UNI™ Judge AI App': 3000,
  'Digital-UNI™ Court AI Clerk Assistant': 2800,
  'Digital-UNI™ Court AI Expert': 3000,
  'Digital-UNI™ AI Agent for Proof-of-Service & Jurisdiction Compatibility': 3200
} as const;

export const professionalProgramNames = [
  'AI and Machine Learning',
  'Computer Vision and CNN',
  'TensorFlow / Keras / ANN',
  'Data Science and Visualization',
  'Cybersecurity and Cloud Security',
  'Blockchain and Digital Currency'
] as const;

export const executiveProgramNames = [
  'Executive AI Leadership: CEO, CTO, CIO, COO',
  'AI Corporate Financial Audit',
  'AI Mergers and Acquisitions',
  'Digital-UNI™ Lawyer AI App',
  'Digital-UNI™ Judge AI App',
  'Digital-UNI™ Court AI Clerk Assistant',
  'Digital-UNI™ Court AI Expert',
  'Digital-UNI™ AI Agent for Proof-of-Service & Jurisdiction Compatibility'
] as const;

export const programNames = Object.keys(programCatalog) as [keyof typeof programCatalog, ...(keyof typeof programCatalog)[]];
export const pathwayTrackValues = ['professional', 'executive'] as const;
export const ticketPaymentValues = [
  'Full route in advance',
  'Two advance installments',
  'Station-by-station installments'
] as const;

export type PathwayTrack = (typeof pathwayTrackValues)[number];
export type TicketPaymentPreference = (typeof ticketPaymentValues)[number];

export type TrainTicketSegment = {
  station: number;
  title: string;
  duration: string;
  price: number;
};

export const trainPathwayCatalog: Record<
  PathwayTrack,
  { label: string; duration: string; startingPrice: number; segments: TrainTicketSegment[] }
> = {
  professional: {
    label: 'Professional Certification Pathway',
    duration: '12 weeks',
    startingPrice: 3000,
    segments: [
      { station: 1, title: 'Career and AI skills map', duration: '1 week', price: 300 },
      { station: 2, title: 'Core professional specialization', duration: '4 weeks', price: 1050 },
      { station: 3, title: 'Applied AI lab and portfolio project', duration: '4 weeks', price: 1050 },
      { station: 4, title: 'Assessment and Digital-UNI credential review', duration: '3 weeks', price: 600 }
    ]
  },
  executive: {
    label: 'Executive AI Leadership Pathway',
    duration: '6 weeks',
    startingPrice: 25000,
    segments: [
      { station: 1, title: 'Executive diagnostic and AI strategy', duration: '1 week', price: 4000 },
      { station: 2, title: 'Enterprise AI economics and use cases', duration: '2 weeks', price: 7000 },
      { station: 3, title: 'Governance, security and risk', duration: '1 week', price: 5000 },
      { station: 4, title: 'Executive capstone and advisory roadmap', duration: '2 weeks', price: 9000 }
    ]
  }
};

export const programNamesByTrack: Record<PathwayTrack, readonly (keyof typeof programCatalog)[]> = {
  professional: professionalProgramNames,
  executive: executiveProgramNames
};

export function getTrainPathway(track: PathwayTrack) {
  return trainPathwayCatalog[track];
}

export function getTicketPaymentSummary(track: PathwayTrack, preference: TicketPaymentPreference) {
  const route = getTrainPathway(track);
  if (preference === 'Full route in advance') return [`1 advance route ticket · $${route.startingPrice.toLocaleString('en-US')}`];
  if (preference === 'Two advance installments') {
    const first = Math.ceil(route.startingPrice / 2);
    return [`Installment 1 · $${first.toLocaleString('en-US')}`, `Installment 2 · $${(route.startingPrice - first).toLocaleString('en-US')}`];
  }
  return route.segments.map(segment => `Station ${segment.station} · $${segment.price.toLocaleString('en-US')}`);
}

const clean = z.string().trim().min(1).max(1500).transform(value => value.replace(/[<>]/g, ''));

export const applicantAnswersSchema = z.object({
  name: clean.pipe(z.string().min(2).max(120)),
  email: z.string().trim().email().max(254),
  pathwayTrack: z.enum(pathwayTrackValues),
  learningGoals: clean,
  currentExperience: clean,
  careerOutcome: clean,
  programInterest: z.enum(programNames),
  studyDuration: clean.pipe(z.string().max(100)),
  weeklyHours: clean.pipe(z.string().max(100)),
  budget: clean.pipe(z.string().max(100)),
  installmentPreference: z.enum(ticketPaymentValues),
  financialAid: z.boolean(),
  preferredLanguage: z.enum(['English', 'Arabic', 'French'])
}).superRefine((answers, context) => {
  if (!programNamesByTrack[answers.pathwayTrack].includes(answers.programInterest)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['programInterest'], message: 'Select a program on the chosen AI Train pathway.' });
  }
});

export const aiGeneratedPlanSchema = z.object({
  applicantName: z.string(), applicantEmail: z.string().email(), preferredLanguage: z.enum(['English', 'Arabic', 'French']),
  learningGoals: z.string(), currentExperience: z.string(), recommendedProgram: z.enum(programNames), alternativeProgram: z.enum(programNames),
  proposedDuration: z.string(), weeklySchedule: z.array(z.string()).min(1).max(12), skillsAndModules: z.array(z.string()).min(1).max(12),
  appliedProject: z.string(), personalizedAiApplicationOutcome: z.string(), applicantBudget: z.string(),
  financialAidInquiryStatus: z.boolean(), assumptionsAndDisclaimers: z.array(z.string()).min(1).max(10)
});

const ticketSegmentSchema = z.object({
  station: z.number().int().min(1).max(12),
  title: z.string(),
  duration: z.string(),
  price: z.number().nonnegative()
});

export const planSchema = aiGeneratedPlanSchema.extend({
  pathwayTrack: z.enum(pathwayTrackValues),
  routeLabel: z.string(),
  routeDuration: z.string(),
  ticketSegments: z.array(ticketSegmentSchema).min(1).max(12),
  ticketTotal: z.number().nonnegative(),
  tuitionStartingPrice: z.number().nonnegative(),
  requestedInstallmentPreference: z.enum(ticketPaymentValues),
  paymentSchedule: z.array(z.string()).min(1).max(12)
});

export const applicantReviewSchema = z.object({
  answers: applicantAnswersSchema,
  plan: planSchema,
  planToken: z.string().min(40).max(200)
});

export const submissionSchema = applicantReviewSchema.extend({
  consent: z.literal(true),
  reviewed: z.literal(true),
  website: z.string().max(0).optional()
});

export type ApplicantAnswers = z.infer<typeof applicantAnswersSchema>;
export type ApplicantPlan = z.infer<typeof planSchema>;

export const legalProgramNotice = 'Legal and judicial AI programs are educational decision-support applications. They do not provide legal advice, validate service, establish jurisdiction, replace lawyers or judges, guarantee outcomes, or represent court endorsement.';
export const brochureDisclaimer = 'This brochure and AI Train ticket are personalized program proposals, not enrollment acceptance, financial-aid approval, an installment agreement, accreditation determination, a payment receipt, or a guarantee of certification. Route prices are planning estimates. Final itinerary, access, payment dates, and terms require Digital-UNI review and written confirmation.';
