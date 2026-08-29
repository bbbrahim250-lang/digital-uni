import { NextRequest, NextResponse } from 'next/server';
import {
  aiGeneratedPlanSchema,
  applicantAnswersSchema,
  getTicketPaymentSummary,
  getTrainPathway,
  legalProgramNotice,
  planSchema,
  programCatalog,
  programNames,
  programNamesByTrack
} from '@/lib/applicant-planning';
import { rateLimit } from '@/lib/rate-limit';
import { signApplicantPlan } from '@/lib/applicant-plan-security';

export const runtime = 'nodejs';

type OpenAIErrorPayload = {
  error?: {
    code?: string | null;
    type?: string | null;
  };
};

function openAIErrorMessage(status: number, code?: string | null, type?: string | null) {
  if (status === 401) return 'The AI planning service could not authenticate. Digital-UNI must replace its OpenAI API key.';
  if (status === 403) return 'The AI planning service does not have permission to use the configured OpenAI model.';
  if (status === 404 || code === 'model_not_found') return 'The configured OpenAI model is not available to the Digital-UNI API project.';
  if (status === 429 && (code === 'insufficient_quota' || code === 'credit_balance_exhausted' || type === 'insufficient_quota')) {
    return 'The OpenAI API project needs billing or usage credits before planning can continue.';
  }
  if (status === 429) return 'The AI planning service is receiving too many requests. Please wait and try again.';
  return 'The planning service is temporarily unavailable.';
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(`plan:${ip}`, 8, 60_000)) return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 });
  if (!process.env.OPENAI_API_KEY || !process.env.APPLICANT_PLAN_SIGNING_SECRET) return NextResponse.json({ error: 'AI Planning Assistant Coming Soon' }, { status: 503 });
  const parsed = applicantAnswersSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check your answers.' }, { status: 400 });

  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      applicantName: { type: 'string' }, applicantEmail: { type: 'string' }, preferredLanguage: { type: 'string', enum: ['English', 'Arabic', 'French'] },
      learningGoals: { type: 'string' }, currentExperience: { type: 'string' }, recommendedProgram: { type: 'string', enum: programNames }, alternativeProgram: { type: 'string', enum: programNames },
      proposedDuration: { type: 'string' }, weeklySchedule: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 12 },
      skillsAndModules: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 12 }, appliedProject: { type: 'string' }, personalizedAiApplicationOutcome: { type: 'string' },
      applicantBudget: { type: 'string' }, financialAidInquiryStatus: { type: 'boolean' },
      assumptionsAndDisclaimers: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10 }
    },
    required: ['applicantName','applicantEmail','preferredLanguage','learningGoals','currentExperience','recommendedProgram','alternativeProgram','proposedDuration','weeklySchedule','skillsAndModules','appliedProject','personalizedAiApplicationOutcome','applicantBudget','financialAidInquiryStatus','assumptionsAndDisclaimers']
  };
  const route = getTrainPathway(parsed.data.pathwayTrack);
  const allowedPrograms = programNamesByTrack[parsed.data.pathwayTrack];
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, cache: 'no-store',
      body: JSON.stringify({
        model,
        instructions: `Create a concise applicant learning proposal in ${parsed.data.preferredLanguage} for the selected ${route.label}. Recommend only one of the allowed programs. The candidate's chosen program is the controlling recommendation. Never approve enrollment, aid, credit, certification, installment terms, or scholarships. Prices and installments are proposals only. Include this safeguard where relevant: ${legalProgramNotice}`,
        input: JSON.stringify({
          answers: parsed.data,
          allowedPrograms,
          selectedProgram: parsed.data.programInterest,
          route: { label: route.label, duration: route.duration, proposedStartingPriceUsd: route.startingPrice },
          individualModuleReferencePricesUsd: programCatalog
        }),
        text: { format: { type: 'json_schema', name: 'applicant_plan', strict: true, schema } }
      })
    });
  } catch (error) {
    console.error('[applicant-plan] OpenAI request could not be completed', {
      errorType: error instanceof Error ? error.name : 'unknown',
      model
    });
    return NextResponse.json({ error: 'The planning service could not connect to OpenAI. Please try again.' }, { status: 502 });
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as OpenAIErrorPayload | null;
    const code = payload?.error?.code ?? 'unknown';
    const type = payload?.error?.type ?? 'unknown';
    const requestId = response.headers.get('x-request-id') ?? 'unavailable';
    console.error('[applicant-plan] OpenAI request failed', {
      status: response.status,
      code,
      type,
      requestId,
      model
    });
    return NextResponse.json({ error: openAIErrorMessage(response.status, code, type) }, { status: 502 });
  }
  const result = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  const outputText = result.output_text ?? result.output?.flatMap(item => item.content ?? []).find(item => item.text)?.text;
  const generated = aiGeneratedPlanSchema.safeParse(JSON.parse(outputText ?? 'null'));
  if (!generated.success) return NextResponse.json({ error: 'The proposed plan could not be validated.' }, { status: 502 });
  const alternativeProgram = allowedPrograms.includes(generated.data.alternativeProgram)
    ? generated.data.alternativeProgram
    : allowedPrograms.find(program => program !== parsed.data.programInterest) ?? parsed.data.programInterest;
  const plan = {
    ...generated.data,
    applicantName: parsed.data.name,
    applicantEmail: parsed.data.email,
    preferredLanguage: parsed.data.preferredLanguage,
    recommendedProgram: parsed.data.programInterest,
    alternativeProgram,
    proposedDuration: route.duration,
    applicantBudget: parsed.data.budget,
    financialAidInquiryStatus: parsed.data.financialAid,
    pathwayTrack: parsed.data.pathwayTrack,
    routeLabel: route.label,
    routeDuration: route.duration,
    ticketSegments: route.segments,
    ticketTotal: route.startingPrice,
    tuitionStartingPrice: route.startingPrice,
    requestedInstallmentPreference: parsed.data.installmentPreference,
    paymentSchedule: getTicketPaymentSummary(parsed.data.pathwayTrack, parsed.data.installmentPreference)
  };
  const validatedPlan = planSchema.parse(plan);
  const planToken = signApplicantPlan(parsed.data, validatedPlan, process.env.APPLICANT_PLAN_SIGNING_SECRET);
  return NextResponse.json({ plan: validatedPlan, planToken });
}
