'use client';

import Link from 'next/link';
import { useState } from 'react';

export function PaymentOptions({ locale, methods }: { locale: string; methods: { stripe: boolean; paypal: boolean; crypto: boolean } }) {
  const [accepted, setAccepted] = useState(false);
  return <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
    <h2 className="text-2xl font-bold text-navy-900">Payment methods</h2>
    <label className="my-5 flex items-start gap-3"><input className="mt-1 h-5 w-5" type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span>I accept the <Link className="underline" href={`/${locale}/terms`}>terms</Link> and the refund and cancellation policy in those terms.</span></label>
    <div className="space-y-3">
      <Method name="Credit/debit cards, Apple Pay and Google Pay" available={methods.stripe} accepted={accepted} />
      <Method name="PayPal and PayPal-supported cards" available={methods.paypal} accepted={accepted} />
      <Method name="Bitcoin and supported cryptocurrencies" available={methods.crypto} accepted={accepted} />
      <Method name="Digital-UNI™ digital currency" available={false} accepted={accepted} comingSoon />
    </div>
    <p className="mt-5 text-sm text-navy-600">Checkout uses provider-hosted payment pages; Digital-UNI does not collect or store raw card numbers. Prices and promotion eligibility are validated before an invoice or checkout is issued. Payment is recorded as complete only after a verified provider confirmation.</p>
    <Link href={`/${locale}/enrollment`} className="mt-6 block rounded-lg bg-gold-500 px-5 py-3 text-center font-bold text-navy-900">Request an enrollment invoice</Link>
  </section>;
}

function Method({ name, available, accepted, comingSoon = false }: { name: string; available: boolean; accepted: boolean; comingSoon?: boolean }) {
  return <button type="button" disabled={!available || !accepted} className="flex min-h-14 w-full items-center justify-between rounded-lg border px-4 py-3 text-start disabled:bg-slate-100 disabled:text-slate-500"><span>{name}</span><strong>{available ? (accepted ? 'Continue' : 'Accept terms first') : (comingSoon ? 'Coming Soon' : 'Not Available Yet')}</strong></button>;
}
