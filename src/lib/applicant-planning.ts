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

export const programNames = Object.keys(programCatalog) as [keyof typeof programCatalog, ...(keyof typeof programCatalog)[]];

const clean = z.string().trim().min(1).max(1500).transform(value => value.replace(/[<>]/g, ''));

export const applicantAnswersSchema = z.object({
  name: clean.pipe(z.string().min(2).max(120)),
  email: z.string().trim().email().max(254),
  learningGoals: clean,
  currentExperience: clean,
  careerOutcome: clean,
  programInterest: z.enum(programNames),
  studyDuration: clean.pipe(z.string().max(100)),
  weeklyHours: clean.pipe(z.string().max(100)),
  budget: clean.pipe(z.string().max(100)),
  installmentPreference: z.enum(['Full payment', 'Installments']),
  financialAid: z.boolean(),
  preferredLanguage: z.enum(['English', 'Arabic', 'French'])
});

export const planSchema = z.object({
  applicantName: z.string(), applicantEmail: z.string().email(), preferredLanguage: z.enum(['English', 'Arabic', 'French']),
  learningGoals: z.string(), currentExperience: z.string(), recommendedProgram: z.enum(programNames), alternativeProgram: z.enum(programNames),
  proposedDuration: z.string(), weeklySchedule: z.array(z.string()).min(1).max(12), skillsAndModules: z.array(z.string()).min(1).max(12),
  appliedProject: z.string(), personalizedAiApplicationOutcome: z.string(), tuitionStartingPrice: z.number().nonnegative(), applicantBudget: z.string(),
  requestedInstallmentPreference: z.enum(['Full payment', 'Installments']), financialAidInquiryStatus: z.boolean(), assumptionsAndDisclaimers: z.array(z.string()).min(1).max(10)
});

export const submissionSchema = z.object({
  answers: applicantAnswersSchema,
  plan: planSchema,
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export type ApplicantAnswers = z.infer<typeof applicantAnswersSchema>;
export type ApplicantPlan = z.infer<typeof planSchema>;

export const legalProgramNotice = 'Legal and judicial AI programs are educational decision-support applications. They do not provide legal advice, validate service, establish jurisdiction, replace lawyers or judges, guarantee outcomes, or represent court endorsement.';
export const brochureDisclaimer = 'This brochure is a personalized program proposal, not an enrollment acceptance, financial-aid approval, installment agreement, accreditation determination, or guarantee of certification. Final terms require Digital-UNI review and written confirmation.';
