import { z } from 'zod';

export const tryoutCampusValues = ['santa_monica', 'palo_alto'] as const;
export const tryoutSportValues = ['football', 'basketball', 'soccer'] as const;
export const tryoutSessionValues = ['june_10', 'november_12'] as const;
export const tryoutAgeGroupValues = ['under_18', 'adult'] as const;
export const tryoutInsuranceValues = ['insured', 'not_insured', 'discuss_privately'] as const;

const optionalText = (maximum: number) => z.string().trim().max(maximum).optional().or(z.literal(''));
const normalizedName = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');

export const tryoutApplicationSchema = z.object({
  submissionId: z.string().uuid(),
  campus: z.enum(tryoutCampusValues),
  sport: z.enum(tryoutSportValues),
  session: z.enum(tryoutSessionValues),
  applicantName: z.string().trim().min(2).max(160),
  applicantEmail: z.string().trim().email().max(320),
  applicantPhone: z.string().trim().min(7).max(40),
  ageGroup: z.enum(tryoutAgeGroupValues),
  guardianName: optionalText(160),
  guardianEmail: z.string().trim().email().max(320).optional().or(z.literal('')),
  healthParticipationNotes: optionalText(1200),
  insuranceStatus: z.enum(tryoutInsuranceValues),
  insuranceProvider: optionalText(160),
  insuranceMemberLast4: z.string().trim().regex(/^\d{4}$/).optional().or(z.literal('')),
  athleticHistory: z.string().trim().min(20).max(3000),
  evidenceFilename: z.string().trim().min(1).max(240),
  signatureName: z.string().trim().min(2).max(160),
  accuracyConsent: z.literal(true),
  privacyConsent: z.literal(true),
  healthAcknowledgement: z.literal(true),
  guardianConsent: z.boolean(),
  website: z.string().max(0).optional()
}).superRefine((data, context) => {
  if (normalizedName(data.signatureName) !== normalizedName(data.applicantName)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['signatureName'],
      message: 'The electronic signature must match the applicant name.'
    });
  }
  if (data.ageGroup === 'under_18') {
    if (!data.guardianName?.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['guardianName'], message: 'A guardian name is required for applicants under 18.' });
    }
    if (!data.guardianEmail?.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['guardianEmail'], message: 'A guardian email is required for applicants under 18.' });
    }
    if (!data.guardianConsent) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['guardianConsent'], message: 'Guardian authorization is required for applicants under 18.' });
    }
  }
});

export const reviewedTryoutApplicationSchema = tryoutApplicationSchema.and(z.object({ reviewed: z.literal(true) }));

export type TryoutApplication = z.infer<typeof tryoutApplicationSchema>;

export const tryoutCampusLabels: Record<(typeof tryoutCampusValues)[number], string> = {
  santa_monica: 'Santa Monica, CA',
  palo_alto: 'Palo Alto, CA'
};

export const tryoutSportLabels: Record<(typeof tryoutSportValues)[number], string> = {
  football: 'American Football',
  basketball: 'Basketball',
  soccer: 'Soccer'
};

export const tryoutSessionLabels: Record<(typeof tryoutSessionValues)[number], string> = {
  june_10: 'June 10 annual tryout',
  november_12: 'November 12 annual tryout'
};

export const tryoutInsuranceLabels: Record<(typeof tryoutInsuranceValues)[number], string> = {
  insured: 'Currently insured',
  not_insured: 'Not currently insured',
  discuss_privately: 'Prefer to discuss privately with authorized staff'
};

export const tryoutPrivacyNotice = 'Tryout information is private application material. Digital-UNI limits access to authorized enrollment and coaching reviewers and retains the application for up to 24 months unless law or an active safety matter requires longer. Do not upload medical records, government identification, payment-card information, or a complete insurance policy number.';

export const tryoutDisclaimer = 'A tryout application or brochure does not guarantee team selection, enrollment, athletic eligibility, insurance coverage, medical clearance, playing time, scholarship, or admission. Participation and selection require age-appropriate consent, coach review, applicable medical clearance, insurance confirmation, facility availability, and written Digital-UNI approval.';
