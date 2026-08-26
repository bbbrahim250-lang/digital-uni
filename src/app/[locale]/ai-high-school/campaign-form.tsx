'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  campaignConnectionValues,
  campaignInterestValues,
  campaignSupportSchema,
  type CampaignSupportValues
} from '@/lib/schemas';
import { submitCampaignSupport } from './actions';

export type CampaignFormCopy = {
  name: string;
  email: string;
  phone: string;
  optional: string;
  zipCode: string;
  connection: string;
  interest: string;
  message: string;
  messagePlaceholder: string;
  consent: string;
  legalAcknowledgement: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  invalidSubmission: string;
  submissionFailed: string;
  requiredError: string;
  emailError: string;
  zipError: string;
  connectionOptions: Record<(typeof campaignConnectionValues)[number], string>;
  interestOptions: Record<(typeof campaignInterestValues)[number], string>;
};

export function CampaignForm({ locale, copy }: { locale: string; copy: CampaignFormCopy }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CampaignSupportValues>({
    resolver: zodResolver(campaignSupportSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      zipCode: '',
      connection: 'resident',
      interest: 'general_support',
      message: '',
      supportConsent: false,
      legalAcknowledgement: false,
      website: ''
    }
  });

  async function onSubmit(values: CampaignSupportValues) {
    setServerError(null);
    setStatus('idle');
    const result = await submitCampaignSupport(locale, values);

    if (result.ok) {
      setStatus('success');
      reset();
      return;
    }

    setStatus('error');
    setServerError(result.code === 'invalid_submission' ? copy.invalidSubmission : copy.submissionFailed);
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-300 bg-emerald-50 p-7 text-emerald-950">
        <h3 className="text-xl font-bold">{copy.successTitle}</h3>
        <p className="mt-2 leading-7">{copy.successMessage}</p>
      </div>
    );
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-navy-900 shadow-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-200';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {status === 'error' ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="campaign-name" className="text-sm font-semibold text-navy-900">
            {copy.name}
          </label>
          <input
            id="campaign-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'campaign-name-error' : undefined}
            {...register('name')}
          />
          {errors.name ? <p id="campaign-name-error" className="mt-1 text-sm text-red-700">{copy.requiredError}</p> : null}
        </div>

        <div>
          <label htmlFor="campaign-email" className="text-sm font-semibold text-navy-900">
            {copy.email}
          </label>
          <input
            id="campaign-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'campaign-email-error' : undefined}
            {...register('email')}
          />
          {errors.email ? <p id="campaign-email-error" className="mt-1 text-sm text-red-700">{copy.emailError}</p> : null}
        </div>

        <div>
          <label htmlFor="campaign-phone" className="text-sm font-semibold text-navy-900">
            {copy.phone} <span className="font-normal text-navy-400">({copy.optional})</span>
          </label>
          <input id="campaign-phone" type="tel" autoComplete="tel" className={inputClass} {...register('phone')} />
        </div>

        <div>
          <label htmlFor="campaign-zip" className="text-sm font-semibold text-navy-900">
            {copy.zipCode}
          </label>
          <input
            id="campaign-zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            className={inputClass}
            aria-invalid={Boolean(errors.zipCode)}
            aria-describedby={errors.zipCode ? 'campaign-zip-error' : undefined}
            {...register('zipCode')}
          />
          {errors.zipCode ? <p id="campaign-zip-error" className="mt-1 text-sm text-red-700">{copy.zipError}</p> : null}
        </div>

        <div>
          <label htmlFor="campaign-connection" className="text-sm font-semibold text-navy-900">
            {copy.connection}
          </label>
          <select id="campaign-connection" className={inputClass} {...register('connection')}>
            {campaignConnectionValues.map((value) => (
              <option key={value} value={value}>{copy.connectionOptions[value]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="campaign-interest" className="text-sm font-semibold text-navy-900">
            {copy.interest}
          </label>
          <select id="campaign-interest" className={inputClass} {...register('interest')}>
            {campaignInterestValues.map((value) => (
              <option key={value} value={value}>{copy.interestOptions[value]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="campaign-message" className="text-sm font-semibold text-navy-900">
          {copy.message} <span className="font-normal text-navy-400">({copy.optional})</span>
        </label>
        <textarea
          id="campaign-message"
          rows={4}
          placeholder={copy.messagePlaceholder}
          className={inputClass}
          {...register('message')}
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="campaign-website">Website</label>
        <input id="campaign-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <label className="flex gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4 text-sm leading-6 text-navy-600">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('supportConsent')} />
        <span>{copy.consent}</span>
      </label>
      {errors.supportConsent ? <p className="text-sm text-red-700">{copy.requiredError}</p> : null}

      <label className="flex gap-3 rounded-xl border border-gold-400/40 bg-gold-200/30 p-4 text-sm leading-6 text-navy-700">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('legalAcknowledgement')} />
        <span>{copy.legalAcknowledgement}</span>
      </label>
      {errors.legalAcknowledgement ? <p className="text-sm text-red-700">{copy.requiredError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gold-500 px-6 py-3.5 text-base font-bold text-navy-900 shadow-lg transition hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
