import { brochureDisclaimer, type ApplicantPlan } from './applicant-planning';
import {
  tryoutCampusLabels,
  tryoutDisclaimer,
  tryoutInsuranceLabels,
  tryoutPrivacyNotice,
  tryoutSessionLabels,
  tryoutSportLabels,
  type TryoutApplication
} from './tryout';

function ascii(value: string) { return value.normalize('NFKD').replace(/[^\x20-\x7E]/g, '?'); }
function escape(value: string) { return ascii(value).replace(/([\\()])/g, '\\$1'); }

function assemblePdf(objects: Array<string | Buffer>) {
  const chunks: Buffer[] = [Buffer.from('%PDF-1.4\n', 'binary')];
  const offsets = [0];
  let length = chunks[0]!.length;

  objects.forEach((object, index) => {
    offsets.push(length);
    const header = Buffer.from(`${index + 1} 0 obj\n`, 'binary');
    const body = typeof object === 'string' ? Buffer.from(object, 'binary') : object;
    const footer = Buffer.from('\nendobj\n', 'binary');
    chunks.push(header, body, footer);
    length += header.length + body.length + footer.length;
  });

  const xref = length;
  const table = [
    `xref\n0 ${objects.length + 1}\n`,
    '0000000000 65535 f \n',
    offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join(''),
    `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  ].join('');
  chunks.push(Buffer.from(table, 'binary'));
  return Buffer.concat(chunks);
}

export function createBrochurePdf(
  plan: ApplicantPlan,
  reference: string,
  generated: string,
  counselorReview = 'Digital-UNI human counselor review requested'
) {
  const lines = [
    'DIGITAL-UNI(TM) PERSONALIZED LEARNING PATHWAY', 'Digital-UNI | www.digital-uni.net | 213-708-4890',
    'enroll@digital-uni.net | financial_aid@digital-uni.net', '', `Applicant: ${plan.applicantName}`, `Application reference: ${reference}`,
    `Generation date: ${generated}`, `AI Train route: ${plan.routeLabel}`, `Route duration: ${plan.routeDuration}`,
    `Selected program: ${plan.recommendedProgram}`, `Learning objectives: ${plan.learningGoals}`,
    'Proposed ticket itinerary:',
    ...plan.ticketSegments.map(segment => `Station ${segment.station}: ${segment.title} | ${segment.duration} | USD ${segment.price.toLocaleString('en-US')}`),
    `Proposed complete-route ticket: USD ${plan.ticketTotal.toLocaleString('en-US')}`,
    `Requested reservation schedule: ${plan.requestedInstallmentPreference}`,
    ...plan.paymentSchedule.map(item => `  ${item}`),
    `Program modules: ${plan.skillsAndModules.join(' | ')}`, `Weekly learning schedule: ${plan.weeklySchedule.join(' | ')}`,
    `Applied project: ${plan.appliedProject}`, `Personalized AI application: ${plan.personalizedAiApplicationOutcome}`,
    `Duration: ${plan.proposedDuration}`, `Applicant stated budget: ${plan.applicantBudget}`,
    `Financial-aid-information request: ${plan.financialAidInquiryStatus ? 'Yes' : 'No'}`, '', 'Enrollment next steps:',
    `Counselor review route: ${counselorReview}`,
    'Any AI counselor output is a preliminary recommendation only. Enrollment, eligibility, financial aid, and course approval require authorized human review and written confirmation.',
    'Digital-UNI staff review, written confirmation, then secure payment if approved.', '', brochureDisclaimer
  ];
  const wrapped = lines.flatMap(line => line.match(/.{1,88}(?:\s|$)/g)?.map(x => x.trim()) ?? ['']);
  const content = wrapped.slice(0, 48).map((line, i) => `BT /F1 ${i === 0 ? 16 : 10} Tf 54 ${760 - i * 14} Td (${escape(line)}) Tj ET`).join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];
  return assemblePdf(objects);
}

export function createTryoutApplicationPdf(
  application: TryoutApplication,
  reference: string,
  generated: string,
  status = 'REVIEW COPY - NOT SUBMITTED'
) {
  const lines = [
    'DIGITAL-UNI(TM) AI PIONEERS SHARKS',
    'PROFESSIONAL ATHLETIC TRYOUT APPLICATION BROCHURE',
    'Digital-UNI | www.digital-uni.net | enroll@digital-uni.net | 213-708-4890',
    '',
    status,
    `Application ID: ${reference}`,
    `Prepared: ${generated}`,
    '',
    `Campus: ${tryoutCampusLabels[application.campus]}`,
    `Sport: ${tryoutSportLabels[application.sport]}`,
    `Tryout session: ${tryoutSessionLabels[application.session]}`,
    `Applicant: ${application.applicantName}`,
    `Email: ${application.applicantEmail}`,
    `Phone: ${application.applicantPhone}`,
    `Age group: ${application.ageGroup === 'under_18' ? 'Under 18' : '18 or older'}`,
    `Guardian: ${application.guardianName || 'Not required'}`,
    `Guardian email: ${application.guardianEmail || 'Not required'}`,
    '',
    'Coach selection information:',
    `Athletic history: ${application.athleticHistory}`,
    `Resume or game video: ${application.evidenceFilename}`,
    '',
    'Participation and insurance information:',
    `Health or participation notes: ${application.healthParticipationNotes || 'None provided'}`,
    `Insurance status: ${tryoutInsuranceLabels[application.insuranceStatus]}`,
    `Insurance provider: ${application.insuranceProvider || 'Not provided'}`,
    `Member ID last four: ${application.insuranceMemberLast4 || 'Not provided'}`,
    '',
    `Electronic signature: ${application.signatureName}`,
    'The applicant confirms that the information is true and complete to the best of their knowledge and authorizes private coaching and enrollment review.',
    '',
    tryoutPrivacyNotice,
    '',
    tryoutDisclaimer,
    '',
    'Review this brochure and the attached resume or game video. Use Make Changes if anything is incorrect. Nothing is submitted until the applicant personally presses Submit Application.'
  ];
  const wrapped = lines.slice(4).flatMap(line => line.match(/.{1,84}(?:\s|$)/g)?.map(value => value.trim()) ?? ['']);
  const bodyCommands = wrapped.slice(0, 45).map((line, index) => {
    const font = line === status ? '/F2' : '/F1';
    return `0.03 0.08 0.12 rg BT ${font} 9 Tf 48 ${686 - index * 14} Td (${escape(line)}) Tj ET`;
  });
  const content = [
    '0.02 0.07 0.12 rg 0 720 612 72 re f',
    '0.83 0.66 0.24 rg 0 716 612 4 re f',
    `1 1 1 rg BT /F2 15 Tf 48 764 Td (${escape(lines[0]!)}) Tj ET`,
    `0.83 0.66 0.24 rg BT /F2 11 Tf 48 744 Td (${escape(lines[1]!)}) Tj ET`,
    `0.8 0.9 0.88 rg BT /F1 8 Tf 48 729 Td (${escape(lines[2]!)}) Tj ET`,
    ...bodyCommands,
    '0.83 0.66 0.24 rg 48 22 516 1 re f',
    '0.15 0.25 0.3 rg BT /F1 7 Tf 48 10 Td (Private review document | Digital-UNI AI Pioneers Sharks) Tj ET'
  ].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>'
  ];
  return assemblePdf(objects);
}

export type CommunitySupportLetterInput = {
  generated: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  zipCode: string;
  connection: string;
  interest: string;
  message?: string;
  signatureName: string;
};

export function createCommunitySupportLetterPdf(
  input: CommunitySupportLetterInput,
  teamLogoJpeg: Buffer,
  logoSize: { width: number; height: number }
) {
  const letterLines = [
    'DIGITAL-UNI(TM) AI HIGH SCHOOL - SANTA MONICA',
    'AI PIONEERS SHARKS | COMMUNITY SUPPORT REVIEW LETTER',
    'www.digital-uni.net | enroll@digital-uni.net | 213-708-4890',
    '',
    'DRAFT REVIEW COPY - NOT SUBMITTED',
    `Review reference: ${input.reference}`,
    `Prepared: ${input.generated}`,
    '',
    'Subject: Community support for the proposed Santa Monica AI-Native Private High School',
    '',
    'To Digital-UNI and the Santa Monica City Council Office:',
    '',
    `I, ${input.name}, register my community support for the proposed Digital-UNI Santa Monica AI High School initiative and its AI Pioneers Sharks athletics program.`,
    '',
    `Community connection: ${input.connection}`,
    `Primary area of interest: ${input.interest}`,
    `ZIP code: ${input.zipCode}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'Not provided'}`,
    '',
    'Supporter comment:',
    input.message || 'No additional comment provided.',
    '',
    `Electronic signature: ${input.signatureName}`,
    '',
    'I confirm that my typed name is my electronic signature and that the information above is accurate. I authorize Digital-UNI to register this support and send a copy to the Santa Monica City Council Office.',
    '',
    'LEGAL NOTICE: This is a community-support registration, not a statutory municipal initiative or ballot-petition signature. Site control, school authorization, land-use review, historic preservation, permits, financing, and public approvals remain required.',
    '',
    'Review this letter carefully. Use Make Changes if anything is incorrect. The final Submit Support button is the action that sends and stores the submission.'
  ];

  const wrapped = letterLines.flatMap(line => line.match(/.{1,78}(?:\s|$)/g)?.map(value => value.trim()) ?? ['']);
  const textCommands = wrapped.slice(0, 45).map((line, index) => {
    const font = index < 2 || line === 'DRAFT REVIEW COPY - NOT SUBMITTED' ? '/F2' : '/F1';
    const size = index === 0 ? 15 : index === 1 ? 11 : 9;
    return `BT ${font} ${size} Tf 48 ${750 - index * 15} Td (${escape(line)}) Tj ET`;
  });
  const content = [
    '0.02 0.17 0.14 rg 0 770 612 22 re f',
    '0.83 0.66 0.24 RG 1.5 w 48 704 m 564 704 l S',
    'q 82 0 0 96 478 658 cm /Im1 Do Q',
    ...textCommands
  ].join('\n');
  const imageObject = Buffer.concat([
    Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${logoSize.width} /Height ${logoSize.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${teamLogoJpeg.length} >>\nstream\n`, 'binary'),
    teamLogoJpeg,
    Buffer.from('\nendstream', 'binary')
  ]);
  const objects: Array<string | Buffer> = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Im1 7 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    imageObject
  ];
  return assemblePdf(objects);
}
