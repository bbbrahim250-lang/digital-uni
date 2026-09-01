import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import type { TryoutApplication } from './tryout';

export function signTryoutApplication(application: TryoutApplication, secret: string) {
  return createHmac('sha256', secret).update(JSON.stringify(application)).digest('base64url');
}

export function verifyTryoutApplication(application: TryoutApplication, token: string, secret: string) {
  const expected = Buffer.from(signTryoutApplication(application, secret));
  const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
