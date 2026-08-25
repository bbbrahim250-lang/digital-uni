import { describe, expect, it } from 'vitest';
import { applicantAnswersSchema, brochureDisclaimer, programCatalog } from './applicant-planning';
import { createBrochurePdf } from './pdf';

const answers = { name: 'Ada Applicant', email: 'ada@example.com', learningGoals: 'Build useful AI systems', currentExperience: 'Software developer', careerOutcome: 'Lead an AI team', programInterest: 'AI and Machine Learning', studyDuration: '12 weeks', weeklyHours: '8', budget: '$2,500', installmentPreference: 'Installments', financialAid: true, preferredLanguage: 'English' } as const;

describe('applicant planning safeguards', () => {
  it('accepts the complete question set and rejects sensitive-looking markup', () => {
    const parsed = applicantAnswersSchema.parse({ ...answers, learningGoals: '<b>AI</b>' });
    expect(parsed.learningGoals).toBe('bAI/b');
  });

  it('creates a PDF from server-controlled plan data', () => {
    const pdf = createBrochurePdf({ applicantName: answers.name, applicantEmail: answers.email, preferredLanguage: answers.preferredLanguage, learningGoals: answers.learningGoals, currentExperience: answers.currentExperience, recommendedProgram: answers.programInterest, alternativeProgram: 'Data Science and Visualization', proposedDuration: answers.studyDuration, weeklySchedule: ['Two evenings'], skillsAndModules: ['Responsible AI'], appliedProject: 'Assistant', personalizedAiApplicationOutcome: 'A validated prototype', tuitionStartingPrice: programCatalog[answers.programInterest], applicantBudget: answers.budget, requestedInstallmentPreference: answers.installmentPreference, financialAidInquiryStatus: answers.financialAid, assumptionsAndDisclaimers: [brochureDisclaimer] }, 'DU-TEST', '2026-08-25');
    expect(pdf.subarray(0, 8).toString()).toBe('%PDF-1.4');
    expect(pdf.toString()).toContain('USD 2,400');
    expect(pdf.toString()).toContain('not an enrollment acceptance');
  });
});
