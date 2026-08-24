import { describe, expect, it } from 'vitest';
import { contactFormSchema } from './schemas';

const validRequest = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  program: 'AI and Machine Learning',
  message: 'Please tell me more about this program.'
};

describe('contactFormSchema', () => {
  it('accepts a complete enrollment request', () => {
    expect(contactFormSchema.safeParse(validRequest).success).toBe(true);
  });

  it('uses a helpful message when the request is too short', () => {
    const result = contactFormSchema.safeParse({ ...validRequest, message: 'Too short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toContain(
        'Please enter at least 10 characters so we can understand your request.'
      );
    }
  });

  it('requires a program selection', () => {
    expect(contactFormSchema.safeParse({ ...validRequest, program: '' }).success).toBe(false);
  });
});
