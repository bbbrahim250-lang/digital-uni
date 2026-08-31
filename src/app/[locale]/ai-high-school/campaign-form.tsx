'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  campaignConnectionValues,
  campaignInterestValues,
  campaignSupportSchema,
  type CampaignSupportValues
} from '@/lib/schemas';
import { submitCampaignSupport } from './actions';
import { TurnstileWidget } from './turnstile-widget';

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
  signatureName: string;
  signatureHelp: string;
  signatureMismatch: string;
  signatureConsent: string;
  consent: string;
  cityCopyConsent: string;
  legalAcknowledgement: string;
  humanVerification: string;
  verificationUnavailable: string;
  submit: string;
  submitting: string;
  reviewButton: string;
  reviewCreating: string;
  reviewTitle: string;
  reviewIntro: string;
  reviewNotice: string;
  downloadLetter: string;
  makeChanges: string;
  finalSubmit: string;
  finalSubmitting: string;
  successTitle: string;
  successMessage: string;
  referenceLabel: string;
  deliveryPendingWarning: string;
  invalidSubmission: string;
  submissionFailed: string;
  verificationFailed: string;
  deliveryUnavailable: string;
  deliveryFailed: string;
  backupWarning: string;
  emailFallback: string;
  requiredError: string;
  emailError: string;
  zipError: string;
  connectionOptions: Record<(typeof campaignConnectionValues)[number], string>;
  interestOptions: Record<(typeof campaignInterestValues)[number], string>;
};

function createSubmissionId() {
  return globalThis.crypto?.randomUUID?.() ?? '00000000-0000-4000-8000-000000000000';
}

const emailFallbackHref =
  'mailto:enroll@digital-uni.net,financial_aid@digital-uni.net?cc=council.mailbox@santamonica.gov&subject=Santa%20Monica%20AI%20High%20School%20community%20support';

export function CampaignForm({
  locale,
  copy,
  turnstileSiteKey
}: {
  locale: string;
  copy: CampaignFormCopy;
  turnstileSiteKey: string;
}) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [backupStored, setBackupStored] = useState(true);
  const [emailDelivered, setEmailDelivered] = useState(true);
  const [reference, setReference] = useState('');
  const [reviewValues, setReviewValues] = useState<CampaignSupportValues | null>(null);
  const [letterUrl, setLetterUrl] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CampaignSupportValues>({
    resolver: zodResolver(campaignSupportSchema),
    defaultValues: {
      submissionId: createSubmissionId(),
      name: '',
      email: '',
      phone: '',
      zipCode: '',
      connection: 'resident',
      interest: 'general_support',
      message: '',
      signatureName: '',
      signatureConsent: false,
      supportConsent: false,
      cityCopyConsent: false,
      legalAcknowledgement: false,
      turnstileToken: '',
      website: ''
    }
  });

  const handleTurnstileToken = useCallback(
    (token: string) => setValue('turnstileToken', token, { shouldValidate: true }),
    [setValue]
  );

  function clearReviewLetter() {
    setLetterUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
  }

  async function beginReview(values: CampaignSupportValues) {
    setServerError(null);
    setStatus('idle');
    const response = await fetch('/api/community-support-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: copy.submissionFailed }));
      setStatus('error');
      setServerError(data.error ?? copy.submissionFailed);
      return;
    }

    const url = URL.createObjectURL(await response.blob());
    clearReviewLetter();
    setLetterUrl(url);
    setReviewValues(values);
  }

  async function submitReviewed() {
    if (!reviewValues) return;
    setServerError(null);
    setStatus('idle');
    setReviewSubmitting(true);
    const result = await submitCampaignSupport(locale, { ...reviewValues, reviewed: true });
    setReviewSubmitting(false);

    if (result.ok) {
      setStatus('success');
      setBackupStored(result.backupStored);
      setEmailDelivered(result.emailDelivered);
      setReference(result.reference);
      setReviewValues(null);
      clearReviewLetter();
      reset({
        submissionId: createSubmissionId(),
        name: '', email: '', phone: '', zipCode: '', connection: 'resident', interest: 'general_support',
        message: '', signatureName: '', signatureConsent: false, supportConsent: false,
        cityCopyConsent: false, legalAcknowledgement: false, turnstileToken: '', website: ''
      });
      return;
    }

    setStatus('error');
    const errorCopy = {
      invalid_submission: copy.invalidSubmission,
      verification_failed: copy.verificationFailed,
      delivery_unavailable: copy.deliveryUnavailable,
      delivery_failed: copy.deliveryFailed
    } as const;
    setServerError(errorCopy[result.code] ?? copy.submissionFailed);
  }

  useEffect(() => () => {
    if (letterUrl) URL.revokeObjectURL(letterUrl);
  }, [letterUrl]);

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-300 bg-emerald-50 p-7 text-emerald-950">
        <h3 className="text-xl font-bold">{copy.successTitle}</h3>
        <p className="mt-2 leading-7">{copy.successMessage}</p>
        <p className="mt-3 rounded-lg bg-white/70 px-4 py-3 font-mono text-sm font-bold">
          {copy.referenceLabel}: {reference}
        </p>
        {!emailDelivered ? (
          <>
            <p className="mt-3 text-sm leading-6">{copy.deliveryPendingWarning}</p>
            <a href={emailFallbackHref} className="mt-3 inline-flex text-sm font-bold text-highlight-electric underline">
              {copy.emailFallback}
            </a>
          </>
        ) : null}
        {!backupStored ? <p className="mt-3 text-sm leading-6">{copy.backupWarning}</p> : null}
      </div>
    );
  }

  if (reviewValues && letterUrl) {
    const reviewReference = `DU-SM-${reviewValues.submissionId.slice(0, 8).toUpperCase()}`;
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-card">
        <div className="flex flex-col gap-5 bg-gradient-to-r from-navy-900 via-emerald-950 to-navy-900 p-6 text-white sm:flex-row sm:items-center">
          <Image
            src="/images/digital-uni-ai-pioneers-sharks-santa-monica.webp"
            alt="Digital-UNI Santa Monica AI Pioneers Sharks team logo"
            width={1122}
            height={1402}
            sizes="96px"
            className="h-28 w-24 shrink-0 rounded-xl bg-white object-contain"
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-gold-400">Digital-UNI AI High School · Santa Monica</p>
            <h3 className="mt-2 text-2xl font-black">{copy.reviewTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-navy-50">{copy.reviewIntro}</p>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {status === 'error' ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {serverError}
            </div>
          ) : null}

          <div className="rounded-xl border border-gold-400/50 bg-gold-200/20 p-5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-gold-700">{copy.reviewNotice}</p>
            <p className="mt-2 font-mono text-sm font-bold text-navy-900">{reviewReference}</p>
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="font-black text-navy-900">{copy.name}</dt><dd className="mt-1 break-words text-navy-600">{reviewValues.name}</dd></div>
            <div><dt className="font-black text-navy-900">{copy.email}</dt><dd className="mt-1 break-words text-navy-600">{reviewValues.email}</dd></div>
            <div><dt className="font-black text-navy-900">{copy.zipCode}</dt><dd className="mt-1 text-navy-600">{reviewValues.zipCode}</dd></div>
            <div><dt className="font-black text-navy-900">{copy.connection}</dt><dd className="mt-1 text-navy-600">{copy.connectionOptions[reviewValues.connection]}</dd></div>
            <div className="sm:col-span-2"><dt className="font-black text-navy-900">{copy.interest}</dt><dd className="mt-1 text-navy-600">{copy.interestOptions[reviewValues.interest]}</dd></div>
            <div className="sm:col-span-2"><dt className="font-black text-navy-900">{copy.message}</dt><dd className="mt-1 whitespace-pre-wrap text-navy-600">{reviewValues.message || '—'}</dd></div>
            <div className="sm:col-span-2"><dt className="font-black text-navy-900">{copy.signatureName}</dt><dd className="mt-1 text-navy-600">{reviewValues.signatureName}</dd></div>
          </dl>

          <a
            href={letterUrl}
            download="digital-uni-santa-monica-support-review.pdf"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-navy-900 px-5 text-center font-black text-white hover:bg-navy-800"
          >
            {copy.downloadLetter}
          </a>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={reviewSubmitting}
              onClick={() => {
                setReviewValues(null);
                clearReviewLetter();
                setStatus('idle');
                setServerError(null);
              }}
              className="min-h-12 rounded-xl border border-navy-200 bg-white px-5 font-bold text-navy-900"
            >
              {copy.makeChanges}
            </button>
            <button
              type="button"
              disabled={reviewSubmitting}
              onClick={() => void submitReviewed()}
              className="min-h-12 rounded-xl bg-gold-500 px-5 font-black text-navy-900 shadow-lg disabled:opacity-60"
            >
              {reviewSubmitting ? copy.finalSubmitting : copy.finalSubmit}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-navy-900 shadow-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-200';

  return (
    <form onSubmit={handleSubmit(beginReview)} noValidate className="space-y-5">
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

      <input type="hidden" {...register('submissionId')} />
      <input type="hidden" {...register('turnstileToken')} />

      <div className="rounded-2xl border border-highlight-turquoise/30 bg-teal-50 p-5">
        <label htmlFor="campaign-signature" className="text-sm font-bold text-navy-900">
          {copy.signatureName}
        </label>
        <p className="mt-1 text-sm leading-6 text-navy-600">{copy.signatureHelp}</p>
        <input
          id="campaign-signature"
          type="text"
          autoComplete="name"
          className={inputClass}
          aria-invalid={Boolean(errors.signatureName)}
          {...register('signatureName')}
        />
        {errors.signatureName ? <p className="mt-1 text-sm text-red-700">{copy.signatureMismatch}</p> : null}
        <label className="mt-4 flex gap-3 text-sm leading-6 text-navy-700">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('signatureConsent')} />
          <span>{copy.signatureConsent}</span>
        </label>
        {errors.signatureConsent ? <p className="mt-1 text-sm text-red-700">{copy.requiredError}</p> : null}
      </div>

      <label className="flex gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4 text-sm leading-6 text-navy-600">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('supportConsent')} />
        <span>{copy.consent}</span>
      </label>
      {errors.supportConsent ? <p className="text-sm text-red-700">{copy.requiredError}</p> : null}

      <label className="flex gap-3 rounded-xl border border-highlight-turquoise/40 bg-teal-50 p-4 text-sm leading-6 text-navy-700">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('cityCopyConsent')} />
        <span>{copy.cityCopyConsent}</span>
      </label>
      {errors.cityCopyConsent ? <p className="text-sm text-red-700">{copy.requiredError}</p> : null}

      <label className="flex gap-3 rounded-xl border border-gold-400/40 bg-gold-200/30 p-4 text-sm leading-6 text-navy-700">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy-900" {...register('legalAcknowledgement')} />
        <span>{copy.legalAcknowledgement}</span>
      </label>
      {errors.legalAcknowledgement ? <p className="text-sm text-red-700">{copy.requiredError}</p> : null}

      <TurnstileWidget
        siteKey={turnstileSiteKey}
        locale={locale}
        label={copy.humanVerification}
        unavailableLabel={copy.verificationUnavailable}
        onToken={handleTurnstileToken}
      />
      {errors.turnstileToken ? <p className="text-sm text-red-700">{copy.verificationFailed}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || !turnstileSiteKey}
        className="w-full rounded-xl bg-gold-500 px-6 py-3.5 text-base font-bold text-navy-900 shadow-lg transition hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? copy.reviewCreating : copy.reviewButton}
      </button>
      <a href={emailFallbackHref} className="block text-center text-sm font-bold text-highlight-electric underline">
        {copy.emailFallback}
      </a>
    </form>
  );
}
