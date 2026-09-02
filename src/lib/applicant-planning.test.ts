import { describe, expect, it } from 'vitest';
import {
  applicantAnswersSchema,
  brochureDisclaimer,
  getTicketPaymentSummary,
  getTrainPathway,
  trainPathwayCatalog
} from './applicant-planning';
import { createBrochurePdf, createCommunitySupportLetterPdf } from './pdf';

const answers = { name: 'Ada Applicant', email: 'ada@example.com', pathwayTrack: 'professional', learningGoals: 'Build useful AI systems', currentExperience: 'Software developer', careerOutcome: 'Lead an AI team', programInterest: 'AI and Machine Learning', studyDuration: '12 weeks', weeklyHours: '8', budget: '$3,000', installmentPreference: 'Station-by-station installments', financialAid: true, preferredLanguage: 'English' } as const;

describe('applicant planning safeguards', () => {
  it('accepts the complete question set and rejects sensitive-looking markup', () => {
    const parsed = applicantAnswersSchema.parse({ ...answers, learningGoals: '<b>AI</b>' });
    expect(parsed.learningGoals).toBe('bAI/b');
  });

  it('creates a PDF from server-controlled plan data', () => {
    const route = getTrainPathway(answers.pathwayTrack);
    const pdf = createBrochurePdf({ applicantName: answers.name, applicantEmail: answers.email, preferredLanguage: answers.preferredLanguage, learningGoals: answers.learningGoals, currentExperience: answers.currentExperience, recommendedProgram: answers.programInterest, alternativeProgram: 'Data Science and Visualization', proposedDuration: route.duration, weeklySchedule: ['Two evenings'], skillsAndModules: ['Responsible AI'], appliedProject: 'Assistant', personalizedAiApplicationOutcome: 'A validated prototype', pathwayTrack: answers.pathwayTrack, routeLabel: route.label, routeDuration: route.duration, ticketSegments: route.segments, ticketTotal: route.startingPrice, tuitionStartingPrice: route.startingPrice, applicantBudget: answers.budget, requestedInstallmentPreference: answers.installmentPreference, paymentSchedule: getTicketPaymentSummary(answers.pathwayTrack, answers.installmentPreference), financialAidInquiryStatus: answers.financialAid, assumptionsAndDisclaimers: [brochureDisclaimer] }, 'DU-TEST', '2026-08-25');
    expect(pdf.subarray(0, 8).toString()).toBe('%PDF-1.4');
    expect(pdf.toString()).toContain('USD 3,000');
    expect(pdf.toString()).toContain('Station 4');
    expect(pdf.toString()).toContain('not enrollment');
    expect(pdf.toString()).toContain('/Count 4');
    expect(pdf.toString()).toContain('PERSONALIZED PROGRAM BROCHURE');
  });

  it('creates a branded community-support review letter without submitting it', () => {
    const onePixelJpeg = Buffer.from(
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EB//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EB//2Q==',
      'base64'
    );
    const pdf = createCommunitySupportLetterPdf({
      generated: '2026-08-31', reference: 'DU-SM-TEST', name: 'Ada Lovelace', email: 'ada@example.com',
      zipCode: '90401', connection: 'Santa Monica resident', interest: 'AI Pioneers Sharks athletics and field',
      message: 'I support this proposal.', signatureName: 'Ada Lovelace'
    }, onePixelJpeg, { width: 1, height: 1 });

    expect(pdf.subarray(0, 8).toString()).toBe('%PDF-1.4');
    expect(pdf.toString('binary')).toContain('AI PIONEERS SHARKS');
    expect(pdf.toString('binary')).toContain('DRAFT REVIEW COPY - NOT SUBMITTED');
    expect(pdf.toString('binary')).toContain('/DCTDecode');
  });

  it('keeps every route total equal to its four station prices', () => {
    for (const route of Object.values(trainPathwayCatalog)) {
      expect(route.segments).toHaveLength(4);
      expect(route.segments.reduce((total, segment) => total + segment.price, 0)).toBe(route.startingPrice);
    }
  });

  it('rejects a professional program placed on the executive route', () => {
    expect(applicantAnswersSchema.safeParse({ ...answers, pathwayTrack: 'executive' }).success).toBe(false);
  });
});
