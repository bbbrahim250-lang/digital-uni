'use client';

import Link from 'next/link';
import { useState } from 'react';

export function StoreCheckout({
  locale,
  checkoutUrl,
  labels
}: {
  locale: string;
  checkoutUrl?: string;
  labels: {
    accept: string;
    terms: string;
    checkout: string;
    acceptFirst: string;
    request: string;
  };
}) {
  const [accepted, setAccepted] = useState(false);

  if (!checkoutUrl) {
    return (
      <Link href={`/${locale}/contact`} className="mt-6 block rounded-lg bg-navy-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-navy-600">
        {labels.request}
      </Link>
    );
  }

  return (
    <div className="mt-6">
      <label className="flex items-start gap-3 text-xs leading-5 text-navy-600">
        <input className="mt-0.5 h-4 w-4" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span>
          {labels.accept}{' '}
          <Link href={`/${locale}/terms`} className="font-bold underline">{labels.terms}</Link>
        </span>
      </label>
      {accepted ? (
        <a href={checkoutUrl} target="_blank" rel="noreferrer" className="mt-4 block rounded-lg bg-gold-500 px-5 py-3 text-center text-sm font-bold text-navy-900 transition hover:bg-gold-400">
          {labels.checkout}
        </a>
      ) : (
        <button type="button" disabled className="mt-4 w-full rounded-lg bg-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
          {labels.acceptFirst}
        </button>
      )}
    </div>
  );
}
