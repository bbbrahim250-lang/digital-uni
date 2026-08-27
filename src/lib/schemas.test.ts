import { describe, expect, it } from 'vitest';
import { campaignSupportSchema, contactFormSchema } from './schemas';

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

const validCampaignSupport = {
  submissionId: '18fd06ae-11b1-4ed0-a7bf-40ed891cfdf0',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '',
  zipCode: '90401',
  connection: 'resident' as const,
  interest: 'private_ai_high_school' as const,
  message: 'I support the proposed school.',
  signatureName: 'Ada Lovelace',
  signatureConsent: true,
  supportConsent: true,
  cityCopyConsent: true,
  legalAcknowledgement: true,
  turnstileToken: 'verified-token',
  website: ''
};

describe('campaignSupportSchema', () => {
  it('accepts a signed submission with City-copy authorization', () => {
    expect(campaignSupportSchema.safeParse(validCampaignSupport).success).toBe(true);
  });

  it('requires the electronic signature to match the supporter name', () => {
    const result = campaignSupportSchema.safeParse({ ...validCampaignSupport, signatureName: 'Someone Else' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.signatureName).toContain(
        'The electronic signature must match the full name.'
      );
    }
  });

  it('requires authorization before copying personal information to the City Council Office', () => {
    expect(campaignSupportSchema.safeParse({ ...validCampaignSupport, cityCopyConsent: false }).success).toBe(false);
  });
});
