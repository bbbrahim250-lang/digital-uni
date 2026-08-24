import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name.').max(200),
  email: z.string().email('Please enter a valid email address.'),
  program: z.string().min(1, 'Please select a program.'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Please enter at least 10 characters so we can understand your request.').max(5000)
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const copyrightRemovalFormSchema = z.object({
  submittedByName: z.string().min(2).max(200),
  submittedByEmail: z.string().email(),
  courseUrl: z.string().url().optional().or(z.literal('')),
  claimDescription: z.string().min(20).max(5000),
  evidenceUrl: z.string().url().optional().or(z.literal(''))
});

export type CopyrightRemovalFormValues = z.infer<typeof copyrightRemovalFormSchema>;
