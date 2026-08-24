'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas';
import { submitContactForm } from './actions';

export const PROGRAMS = [
  'AI and Machine Learning',
  'Cybersecurity',
  'Blockchain and Digital Currency',
  'Executive AI Leadership',
  'AI for Lawyers',
  'AI for Judges and Courts',
  'Court AI Clerk Assistant',
  'Court AI Expert',
  'Digital-UNI™ AI Agent for Proof-of-Service & Jurisdiction Compatibility',
  'Other Digital-UNI™ program'
] as const;

export function ContactForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    const result = await submitContactForm(locale, values);
    if (result.ok) {
      setStatus('success');
      reset();
    } else {
      setStatus('error');
      setServerError(result.error);
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Thank you. Your request has been received by the Digital-UNI enrollment team.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {status === 'error' && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="program" className="block text-sm font-medium text-navy-900">
          Program
        </label>
        <select id="program" defaultValue="" className="mt-1 w-full rounded-md border border-navy-100 bg-white px-3 py-2" aria-invalid={!!errors.program} aria-describedby={errors.program ? 'program-error' : undefined} {...register('program')}>
          <option value="" disabled>Select a program</option>
          {PROGRAMS.map(program => <option key={program} value={program}>{program}</option>)}
        </select>
        {errors.program && <p id="program-error" className="mt-1 text-sm text-red-600">{errors.program.message}</p>}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy-900">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-navy-900">
          Subject (optional)
        </label>
        <input id="subject" type="text" className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2" {...register('subject')} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-900">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gold-500 px-5 py-2.5 font-medium text-navy-900 hover:bg-gold-400 disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
