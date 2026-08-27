export const MAX_RESUME_BYTES = 3 * 1024 * 1024;

const PDF_CONTENT_TYPE = 'application/pdf';
const DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export type ValidatedApplicantResume = {
  filename: string;
  extension: 'pdf' | 'docx';
  contentType: typeof PDF_CONTENT_TYPE | typeof DOCX_CONTENT_TYPE;
  content: Buffer;
};

function safeBaseName(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, '');
  const normalized = withoutExtension.normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return normalized.slice(0, 80) || 'candidate-resume';
}

export function validateApplicantResume(input: {
  filename: string;
  contentType: string;
  content: Buffer;
}): ValidatedApplicantResume {
  if (!input.content.length) throw new Error('The résumé file is empty.');
  if (input.content.length > MAX_RESUME_BYTES) throw new Error('The résumé must be 3 MB or smaller.');

  const extension = input.filename.toLowerCase().endsWith('.pdf')
    ? 'pdf'
    : input.filename.toLowerCase().endsWith('.docx')
      ? 'docx'
      : null;

  if (!extension) throw new Error('Upload the résumé as a PDF or DOCX file.');

  const isPdf = input.content.subarray(0, 5).toString('ascii') === '%PDF-';
  const isZip = input.content[0] === 0x50 && input.content[1] === 0x4b && input.content[2] === 0x03 && input.content[3] === 0x04;

  if (extension === 'pdf' && (!isPdf || ![PDF_CONTENT_TYPE, 'application/octet-stream'].includes(input.contentType))) {
    throw new Error('The selected PDF résumé is not a valid PDF file.');
  }
  if (extension === 'docx' && (!isZip || ![DOCX_CONTENT_TYPE, 'application/zip', 'application/octet-stream'].includes(input.contentType))) {
    throw new Error('The selected DOCX résumé is not a valid DOCX file.');
  }

  const contentType = extension === 'pdf' ? PDF_CONTENT_TYPE : DOCX_CONTENT_TYPE;
  return {
    filename: `${safeBaseName(input.filename)}.${extension}`,
    extension,
    contentType,
    content: input.content
  };
}
