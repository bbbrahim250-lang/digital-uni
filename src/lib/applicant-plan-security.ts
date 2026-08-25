import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import type { ApplicantAnswers, ApplicantPlan } from './applicant-planning';

function payload(answers: ApplicantAnswers, plan: ApplicantPlan) {
  return JSON.stringify({ answers, plan });
}

export function signApplicantPlan(answers: ApplicantAnswers, plan: ApplicantPlan, secret: string) {
  return createHmac('sha256', secret).update(payload(answers, plan)).digest('base64url');
}

export function verifyApplicantPlan(answers: ApplicantAnswers, plan: ApplicantPlan, token: string, secret: string) {
  const expected = Buffer.from(signApplicantPlan(answers, plan, secret));
  const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
