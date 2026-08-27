import { describe, expect, it } from 'vitest';
import { MAX_RESUME_BYTES, validateApplicantResume } from './applicant-files';

describe('applicant résumé safeguards', () => {
  it('accepts and normalizes a small PDF résumé', () => {
    const result = validateApplicantResume({
      filename: 'Ada Résumé 2026.pdf',
      contentType: 'application/pdf',
      content: Buffer.from('%PDF-1.7\nresume')
    });

    expect(result.extension).toBe('pdf');
    expect(result.filename).toBe('Ada-Resume-2026.pdf');
  });

  it('accepts a DOCX ZIP signature', () => {
    const result = validateApplicantResume({
      filename: 'candidate.docx',
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x01])
    });

    expect(result.extension).toBe('docx');
  });

  it('rejects a mismatched PDF extension', () => {
    expect(() => validateApplicantResume({
      filename: 'not-a-resume.pdf',
      contentType: 'application/pdf',
      content: Buffer.from('plain text')
    })).toThrow('not a valid PDF');
  });

  it('rejects files larger than 3 MB', () => {
    expect(() => validateApplicantResume({
      filename: 'large.pdf',
      contentType: 'application/pdf',
      content: Buffer.alloc(MAX_RESUME_BYTES + 1)
    })).toThrow('3 MB or smaller');
  });
});
