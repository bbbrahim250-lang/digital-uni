import { describe, expect, it } from 'vitest';
import { createTryoutApplicationPdf } from './pdf';
import { tryoutApplicationSchema } from './tryout';
import { validateTryoutEvidence } from './tryout-files';

const application = {
  submissionId: '18fd06ae-11b1-4ed0-a7bf-40ed891cfdf0',
  campus: 'santa_monica' as const,
  sport: 'soccer' as const,
  session: 'november_12' as const,
  applicantName: 'Ada Athlete',
  applicantEmail: 'ada@example.com',
  applicantPhone: '213-555-0100',
  ageGroup: 'under_18' as const,
  guardianName: 'Grace Guardian',
  guardianEmail: 'grace@example.com',
  healthParticipationNotes: 'No restrictions reported.',
  insuranceStatus: 'insured' as const,
  insuranceProvider: 'Example Health',
  insuranceMemberLast4: '1234',
  athleticHistory: 'Two seasons of school soccer as a midfielder.',
  evidenceFilename: 'athlete-resume.pdf',
  signatureName: 'Ada Athlete',
  accuracyConsent: true as const,
  privacyConsent: true as const,
  healthAcknowledgement: true as const,
  guardianConsent: true,
  website: ''
};

describe('athletic tryout safeguards', () => {
  it('requires guardian information and consent for an applicant under 18', () => {
    expect(tryoutApplicationSchema.safeParse(application).success).toBe(true);
    expect(tryoutApplicationSchema.safeParse({ ...application, guardianName: '', guardianConsent: false }).success).toBe(false);
  });

  it('requires the electronic signature to match the applicant', () => {
    expect(tryoutApplicationSchema.safeParse({ ...application, signatureName: 'Another Person' }).success).toBe(false);
  });

  it('creates a professional review brochure with an application ID', () => {
    const pdf = createTryoutApplicationPdf(application, 'DU-TRY-2026-18FD06AE', '2026-09-01');
    expect(pdf.subarray(0, 8).toString()).toBe('%PDF-1.4');
    expect(pdf.toString('binary')).toContain('DU-TRY-2026-18FD06AE');
    expect(pdf.toString('binary')).toContain('REVIEW COPY - NOT SUBMITTED');
    expect(pdf.toString('binary')).toContain('Santa Monica, CA');
  });

  it('accepts a short MP4 clip only when its signature matches', () => {
    const content = Buffer.alloc(32);
    content.write('ftyp', 4, 'ascii');
    expect(validateTryoutEvidence({ filename: 'highlights.mp4', contentType: 'video/mp4', content }).kind).toBe('video');
    expect(() => validateTryoutEvidence({ filename: 'highlights.mp4', contentType: 'video/mp4', content: Buffer.from('not a video') })).toThrow();
  });
});
