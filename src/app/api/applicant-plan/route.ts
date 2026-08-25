import { NextRequest, NextResponse } from 'next/server';
import { applicantAnswersSchema, legalProgramNotice, planSchema, programCatalog, programNames } from '@/lib/applicant-planning';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`plan:${ip}`, 8, 60_000)) return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'AI Planning Assistant Coming Soon' }, { status: 503 });
  const parsed = applicantAnswersSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check your answers.' }, { status: 400 });

  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      applicantName: { type: 'string' }, applicantEmail: { type: 'string' }, preferredLanguage: { type: 'string', enum: ['English', 'Arabic', 'French'] },
      learningGoals: { type: 'string' }, currentExperience: { type: 'string' }, recommendedProgram: { type: 'string', enum: programNames }, alternativeProgram: { type: 'string', enum: programNames },
      proposedDuration: { type: 'string' }, weeklySchedule: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 12 },
      skillsAndModules: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 12 }, appliedProject: { type: 'string' }, personalizedAiApplicationOutcome: { type: 'string' },
      tuitionStartingPrice: { type: 'number' }, applicantBudget: { type: 'string' }, requestedInstallmentPreference: { type: 'string', enum: ['Full payment', 'Installments'] },
      financialAidInquiryStatus: { type: 'boolean' }, assumptionsAndDisclaimers: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10 }
    },
    required: ['applicantName','applicantEmail','preferredLanguage','learningGoals','currentExperience','recommendedProgram','alternativeProgram','proposedDuration','weeklySchedule','skillsAndModules','appliedProject','personalizedAiApplicationOutcome','tuitionStartingPrice','applicantBudget','requestedInstallmentPreference','financialAidInquiryStatus','assumptionsAndDisclaimers']
  };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, cache: 'no-store',
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: `Create a concise applicant learning proposal in ${parsed.data.preferredLanguage}. Recommend only a catalog program. Never approve enrollment, aid, credit, certification, installment terms, or scholarships. Installments are requests only. Include this safeguard where relevant: ${legalProgramNotice}`,
      input: JSON.stringify({ answers: parsed.data, serverControlledCatalogUsd: programCatalog }),
      text: { format: { type: 'json_schema', name: 'applicant_plan', strict: true, schema } }
    })
  });
  if (!response.ok) return NextResponse.json({ error: 'The planning service is temporarily unavailable.' }, { status: 502 });
  const result = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  const outputText = result.output_text ?? result.output?.flatMap(item => item.content ?? []).find(item => item.text)?.text;
  const generated = planSchema.safeParse(JSON.parse(outputText ?? 'null'));
  if (!generated.success) return NextResponse.json({ error: 'The proposed plan could not be validated.' }, { status: 502 });
  const plan = { ...generated.data, applicantName: parsed.data.name, applicantEmail: parsed.data.email, preferredLanguage: parsed.data.preferredLanguage, applicantBudget: parsed.data.budget, requestedInstallmentPreference: parsed.data.installmentPreference, financialAidInquiryStatus: parsed.data.financialAid, tuitionStartingPrice: programCatalog[generated.data.recommendedProgram] };
  return NextResponse.json({ plan: planSchema.parse(plan) });
}
