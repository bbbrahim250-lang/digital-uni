import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name.').max(200),
  email: z.string().email('Please enter a valid email address.'),
  program: z.string().min(1, 'Please select a program.'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Please enter at least 10 characters so we can understand your request.').max(5000)
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const campaignConnectionValues = [
  'resident',
  'parent_guardian',
  'student',
  'educator',
  'business_community',
  'other'
] as const;

export const campaignInterestValues = [
  'private_ai_high_school',
  'ai_pioneers_athletics',
  'technology_workforce',
  'investment_partnership',
  'volunteer',
  'general_support'
] as const;

export const campaignSupportSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional(),
  zipCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  connection: z.enum(campaignConnectionValues),
  interest: z.enum(campaignInterestValues),
  message: z.string().trim().max(2000).optional(),
  supportConsent: z.boolean().refine(Boolean),
  legalAcknowledgement: z.boolean().refine(Boolean),
  website: z.string().max(0).optional()
});

export type CampaignSupportValues = z.infer<typeof campaignSupportSchema>;

export const copyrightRemovalFormSchema = z.object({
  submittedByName: z.string().min(2).max(200),
  submittedByEmail: z.string().email(),
  courseUrl: z.string().url().optional().or(z.literal('')),
  claimDescription: z.string().min(20).max(5000),
  evidenceUrl: z.string().url().optional().or(z.literal(''))
});

export type CopyrightRemovalFormValues = z.infer<typeof copyrightRemovalFormSchema>;
