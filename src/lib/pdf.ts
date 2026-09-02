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
  const navy = '0.039 0.067 0.125';
  const emerald = '0.027 0.455 0.333';
  const gold = '0.788 0.612 0.2';
  const slate = '0.22 0.29 0.39';
  const pale = '0.945 0.965 0.975';
  const white = '1 1 1';

  function text(commands: string[], value: string, x: number, y: number, size = 10, font = 'F1', color = navy) {
    commands.push(`${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${escape(value)}) Tj ET`);
  }

  function wrap(value: string, width: number, size = 10) {
    const max = Math.max(18, Math.floor(width / (size * 0.53)));
    const words = ascii(value).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > max && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function paragraph(commands: string[], value: string, x: number, y: number, width: number, size = 10, leading = 14, color = slate, font = 'F1') {
    const lines = wrap(value, width, size);
    lines.forEach((line, index) => text(commands, line, x, y - index * leading, size, font, color));
    return y - lines.length * leading;
  }

  function header(commands: string[], section: string, page: number) {
    commands.push(`${navy} rg 0 752 612 40 re f`, `${gold} rg 0 748 612 4 re f`);
    text(commands, 'DIGITAL-UNI', 42, 769, 13, 'F2', white);
    text(commands, section.toUpperCase(), 420, 769, 8, 'F2', '0.72 0.82 0.82');
    commands.push(`${gold} rg 42 31 528 1 re f`);
    text(commands, 'digital-uni.net  |  enroll@digital-uni.net  |  213-708-4890', 42, 17, 7.5, 'F1', slate);
    text(commands, `${page} / 4`, 535, 17, 7.5, 'F2', slate);
  }

  function contentObject(commands: string[]) {
    const value = commands.join('\n');
    return `<< /Length ${Buffer.byteLength(value, 'binary')} >>\nstream\n${value}\nendstream`;
  }

  const cover: string[] = [];
  cover.push(`${navy} rg 0 0 612 792 re f`, `${emerald} rg 0 0 612 188 re f`, `${gold} rg 0 184 612 4 re f`);
  cover.push('0.06 0.25 0.23 rg 332 390 340 340 re f');
  for (let i = 0; i < 12; i += 1) {
    const x = 345 + (i % 4) * 68;
    const y = 430 + Math.floor(i / 4) * 76;
    text(cover, i % 3 === 0 ? 'AI' : i % 2 === 0 ? '01' : '10', x, y, 24, 'F2', '0.2 0.58 0.47');
  }
  cover.push(`${gold} RG 3 w 48 626 62 62 re S`);
  text(cover, 'DU', 61, 646, 24, 'F2', gold);
  text(cover, 'DIGITAL-UNI', 48, 589, 14, 'F2', gold);
  text(cover, 'PERSONALIZED PROGRAM BROCHURE', 48, 563, 10, 'F2', '0.67 0.85 0.8');
  let coverY = 500;
  for (const line of wrap(plan.recommendedProgram, 475, 32).slice(0, 4)) {
    text(cover, line, 48, coverY, 32, 'F2', white);
    coverY -= 38;
  }
  coverY -= 10;
  coverY = paragraph(cover, `A personalized ${plan.routeLabel.toLowerCase()} prepared for ${plan.applicantName}.`, 48, coverY, 440, 13, 19, '0.8 0.88 0.9');
  text(cover, 'CANDIDATE', 48, 143, 8, 'F2', '0.72 0.95 0.86');
  text(cover, plan.applicantName, 48, 119, 17, 'F2', white);
  text(cover, 'DOCUMENT STATUS', 315, 143, 8, 'F2', '0.72 0.95 0.86');
  text(cover, reference, 315, 119, 13, 'F2', white);
  text(cover, `Prepared ${generated}  |  ${plan.routeDuration} proposed route`, 48, 72, 9, 'F1', white);
  text(cover, 'Private candidate document - review every page before personal submission.', 48, 48, 8, 'F1', '0.75 0.9 0.84');

  const profile: string[] = [];
  header(profile, 'Candidate and program fit', 2);
  text(profile, 'YOUR PROGRAM AT A GLANCE', 42, 712, 9, 'F2', emerald);
  let y = 680;
  y = paragraph(profile, plan.recommendedProgram, 42, y, 520, 25, 30, navy, 'F2') - 8;
  profile.push(`${pale} rg 42 ${y - 95} 528 95 re f`);
  text(profile, 'PROPOSED FORMAT', 60, y - 24, 8, 'F2', emerald);
  text(profile, `${plan.routeLabel} - ${plan.routeDuration}`, 60, y - 46, 13, 'F2', navy);
  text(profile, 'PLANNING ESTIMATE', 348, y - 24, 8, 'F2', emerald);
  text(profile, `USD ${plan.ticketTotal.toLocaleString('en-US')}`, 348, y - 46, 13, 'F2', navy);
  text(profile, 'No payment is collected by this brochure.', 348, y - 65, 8, 'F1', slate);
  y -= 126;
  text(profile, 'CANDIDATE PROFILE', 42, y, 9, 'F2', emerald); y -= 26;
  text(profile, plan.applicantName, 42, y, 16, 'F2', navy); y -= 20;
  text(profile, plan.applicantEmail, 42, y, 10, 'F1', slate); y -= 32;
  text(profile, 'CURRENT EXPERIENCE', 42, y, 8, 'F2', emerald); y -= 18;
  y = paragraph(profile, plan.currentExperience, 42, y, 520, 10, 15) - 18;
  text(profile, 'LEARNING OBJECTIVES', 42, y, 8, 'F2', emerald); y -= 18;
  y = paragraph(profile, plan.learningGoals, 42, y, 520, 10, 15) - 18;
  text(profile, 'PERSONALIZED OUTCOME', 42, y, 8, 'F2', emerald); y -= 18;
  paragraph(profile, plan.personalizedAiApplicationOutcome, 42, y, 520, 10, 15);

  const routePage: string[] = [];
  header(routePage, 'Learning route', 3);
  text(routePage, 'YOUR DIGITAL-UNI AI TRAIN ROUTE', 42, 712, 9, 'F2', emerald);
  text(routePage, `${plan.routeLabel}  |  ${plan.routeDuration}`, 42, 683, 22, 'F2', navy);
  let routeY = 632;
  plan.ticketSegments.forEach(segment => {
    routePage.push(`${segment.station % 2 ? pale : '0.91 0.96 0.94'} rg 42 ${routeY - 70} 528 76 re f`);
    routePage.push(`${emerald} rg 56 ${routeY - 52} 38 38 re f`);
    text(routePage, String(segment.station).padStart(2, '0'), 67, routeY - 40, 13, 'F2', white);
    text(routePage, `Station ${segment.station}  |  ${segment.duration}`, 112, routeY - 24, 8, 'F2', emerald);
    text(routePage, segment.title, 112, routeY - 45, 12, 'F2', navy);
    text(routePage, `USD ${segment.price.toLocaleString('en-US')}`, 460, routeY - 45, 10, 'F2', navy);
    routeY -= 88;
  });
  text(routePage, 'REQUESTED RESERVATION SCHEDULE', 42, routeY - 2, 8, 'F2', emerald);
  text(routePage, plan.requestedInstallmentPreference, 42, routeY - 24, 12, 'F2', navy);
  let paymentY = routeY - 48;
  plan.paymentSchedule.forEach(item => { text(routePage, `- ${item}`, 55, paymentY, 9, 'F1', slate); paymentY -= 16; });
  text(routePage, 'WEEKLY LEARNING RHYTHM', 315, routeY - 2, 8, 'F2', emerald);
  let weeklyY = routeY - 24;
  plan.weeklySchedule.slice(0, 5).forEach(item => { weeklyY = paragraph(routePage, `- ${item}`, 315, weeklyY, 250, 9, 13) - 4; });

  const details: string[] = [];
  header(details, 'Curriculum and next steps', 4);
  text(details, 'WHAT YOU WILL BUILD', 42, 712, 9, 'F2', emerald);
  let detailsY = 680;
  text(details, 'Applied project', 42, detailsY, 18, 'F2', navy); detailsY -= 24;
  detailsY = paragraph(details, plan.appliedProject, 42, detailsY, 520, 10, 15) - 22;
  text(details, 'Proposed skills and modules', 42, detailsY, 18, 'F2', navy); detailsY -= 28;
  plan.skillsAndModules.slice(0, 8).forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const boxX = 42 + column * 266;
    const boxY = detailsY - row * 52;
    details.push(`${pale} rg ${boxX} ${boxY - 34} 254 40 re f`);
    text(details, `${String(index + 1).padStart(2, '0')}  ${item}`, boxX + 12, boxY - 19, 8.5, 'F2', navy);
  });
  detailsY -= Math.ceil(Math.min(plan.skillsAndModules.length, 8) / 2) * 52 + 10;
  text(details, 'COUNSELOR REVIEW AND CANDIDATE CONTROL', 42, detailsY, 9, 'F2', emerald); detailsY -= 24;
  detailsY = paragraph(details, `Review route: ${counselorReview}. Any AI counselor output is preliminary. Enrollment, eligibility, financial aid, and course approval require authorized human review and written confirmation.`, 42, detailsY, 520, 9.5, 14) - 18;
  text(details, 'Next steps', 42, detailsY, 16, 'F2', navy); detailsY -= 25;
  ['1. Open and review this complete brochure.', '2. Review the attached resume and correct anything inaccurate.', '3. Personally choose Make Changes or Submit Application.', '4. Await Digital-UNI written review before any secure payment.'].forEach(item => { text(details, item, 54, detailsY, 9.5, 'F1', slate); detailsY -= 18; });
  details.push('0.99 0.96 0.86 rg 42 55 528 92 re f');
  text(details, 'IMPORTANT PLANNING NOTICE', 56, 126, 8, 'F2', '0.55 0.35 0.02');
  paragraph(details, brochureDisclaimer, 56, 109, 500, 7.5, 10, '0.32 0.27 0.18');

  const pageResource = '/Resources << /Font << /F1 11 0 R /F2 12 0 R >> >>';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R 5 0 R 7 0 R 9 0 R] /Count 4 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ${pageResource} /Contents 4 0 R >>`,
    contentObject(cover),
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ${pageResource} /Contents 6 0 R >>`,
    contentObject(profile),
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ${pageResource} /Contents 8 0 R >>`,
    contentObject(routePage),
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ${pageResource} /Contents 10 0 R >>`,
    contentObject(details),
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
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
