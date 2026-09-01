import { validateApplicantResume } from './applicant-files';

export const MAX_TRYOUT_EVIDENCE_BYTES = 3 * 1024 * 1024;

export type ValidatedTryoutEvidence = {
  filename: string;
  extension: 'pdf' | 'docx' | 'mp4' | 'mov' | 'webm';
  contentType: string;
  content: Buffer;
  kind: 'resume' | 'video';
};

function safeBaseName(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, '');
  const normalized = withoutExtension
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized.slice(0, 80) || 'tryout-evidence';
}

export function validateTryoutEvidence(input: {
  filename: string;
  contentType: string;
  content: Buffer;
}): ValidatedTryoutEvidence {
  if (!input.content.length) throw new Error('The résumé or game video is empty.');
  if (input.content.length > MAX_TRYOUT_EVIDENCE_BYTES) {
    throw new Error('The résumé or short game video must be 3 MB or smaller.');
  }

  const lower = input.filename.toLowerCase();
  if (lower.endsWith('.pdf') || lower.endsWith('.docx')) {
    const resume = validateApplicantResume(input);
    return { ...resume, kind: 'resume' };
  }

  const extension = lower.endsWith('.mp4') ? 'mp4' : lower.endsWith('.mov') ? 'mov' : lower.endsWith('.webm') ? 'webm' : null;
  if (!extension) throw new Error('Upload a PDF/DOCX résumé or a short MP4/MOV/WebM game video.');

  const hasFtyp = input.content.length >= 12 && input.content.subarray(4, 8).toString('ascii') === 'ftyp';
  const isWebm = input.content.length >= 4
    && input.content[0] === 0x1a
    && input.content[1] === 0x45
    && input.content[2] === 0xdf
    && input.content[3] === 0xa3;
  const valid = extension === 'webm' ? isWebm : hasFtyp;
  if (!valid) throw new Error('The selected game video does not match its file format.');

  const allowedContentTypes = extension === 'webm'
    ? ['video/webm', 'application/octet-stream']
    : extension === 'mov'
      ? ['video/quicktime', 'video/mp4', 'application/octet-stream']
      : ['video/mp4', 'application/octet-stream'];
  if (!allowedContentTypes.includes(input.contentType || 'application/octet-stream')) {
    throw new Error('The selected game video has an unsupported content type.');
  }

  return {
    filename: `${safeBaseName(input.filename)}.${extension}`,
    extension,
    contentType: extension === 'webm' ? 'video/webm' : extension === 'mov' ? 'video/quicktime' : 'video/mp4',
    content: input.content,
    kind: 'video'
  };
}
