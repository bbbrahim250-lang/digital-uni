'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { copyrightRemovalFormSchema, type CopyrightRemovalFormValues } from '@/lib/schemas';
import { submitCopyrightRemoval } from './actions';

const fields: Array<{
  name: keyof CopyrightRemovalFormValues;
  label: string;
  type: string;
  required: boolean;
}> = [
  { name: 'submittedByName', label: 'Your name', type: 'text', required: true },
  { name: 'submittedByEmail', label: 'Your email', type: 'email', required: true },
  { name: 'courseUrl', label: 'URL of the content in question (if known)', type: 'url', required: false },
  { name: 'evidenceUrl', label: 'Link to supporting evidence (optional)', type: 'url', required: false }
];

export function CopyrightRemovalForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CopyrightRemovalFormValues>({ resolver: zodResolver(copyrightRemovalFormSchema) });

  async function onSubmit(values: CopyrightRemovalFormValues) {
    setServerError(null);
    const result = await submitCopyrightRemoval(values);
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
        Your request has been received and will be reviewed by our compliance team. Every submission enters the
        administrative audit trail.
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

      {fields.map(({ name, label, type, required }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-navy-900">
            {label}
            {!required && <span className="text-navy-400"> (optional)</span>}
          </label>
          <input
            id={name}
            type={type}
            className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2"
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            {...register(name)}
          />
          {errors[name] && (
            <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="claimDescription" className="block text-sm font-medium text-navy-900">
          Describe the claim
        </label>
        <textarea
          id="claimDescription"
          rows={6}
          className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2"
          aria-invalid={!!errors.claimDescription}
          aria-describedby={errors.claimDescription ? 'claimDescription-error' : undefined}
          {...register('claimDescription')}
        />
        {errors.claimDescription && (
          <p id="claimDescription-error" className="mt-1 text-sm text-red-600">
            {errors.claimDescription.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gold-500 px-5 py-2.5 font-medium text-navy-900 hover:bg-gold-400 disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  );
}
