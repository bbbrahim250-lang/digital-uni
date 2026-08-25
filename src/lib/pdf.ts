import { brochureDisclaimer, type ApplicantPlan } from './applicant-planning';

function ascii(value: string) { return value.normalize('NFKD').replace(/[^\x20-\x7E]/g, '?'); }
function escape(value: string) { return ascii(value).replace(/([\\()])/g, '\\$1'); }

export function createBrochurePdf(plan: ApplicantPlan, reference: string, generated: string) {
  const lines = [
    'DIGITAL-UNI(TM) PERSONALIZED LEARNING PATHWAY', 'Digital-UNI | www.digital-uni.net | 213-708-4890',
    'enroll@digital-uni.net | financial_aid@digital-uni.net', '', `Applicant: ${plan.applicantName}`, `Application reference: ${reference}`,
    `Generation date: ${generated}`, `Recommended pathway: ${plan.recommendedProgram}`, `Learning objectives: ${plan.learningGoals}`,
    `Program modules: ${plan.skillsAndModules.join(' | ')}`, `Weekly learning schedule: ${plan.weeklySchedule.join(' | ')}`,
    `Applied project: ${plan.appliedProject}`, `Personalized AI application: ${plan.personalizedAiApplicationOutcome}`,
    `Duration: ${plan.proposedDuration}`, `Tuition starting price: USD ${plan.tuitionStartingPrice.toLocaleString('en-US')}`,
    `Applicant stated budget: ${plan.applicantBudget}`, `Installment preference (request only): ${plan.requestedInstallmentPreference}`,
    `Financial-aid-information request: ${plan.financialAidInquiryStatus ? 'Yes' : 'No'}`, '', 'Enrollment next steps:',
    'Digital-UNI staff review, written confirmation, then secure payment if approved.', '', brochureDisclaimer
  ];
  const wrapped = lines.flatMap(line => line.match(/.{1,88}(?:\s|$)/g)?.map(x => x.trim()) ?? ['']);
  const content = wrapped.slice(0, 48).map((line, i) => `BT /F1 ${i === 0 ? 16 : 10} Tf 54 ${760 - i * 14} Td (${escape(line)}) Tj ET`).join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, 'binary');
}
