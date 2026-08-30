const paymentMethods = [
  { key: 'visa', name: 'Visa', mark: 'VISA' },
  { key: 'paypal', name: 'PayPal', mark: 'PayPal' },
  { key: 'bitcoin', name: 'Bitcoin', mark: '₿' },
  { key: 'duCoin', name: 'Digital-UNI™ Coin', mark: 'DU' }
] as const;

export function EnrollmentPaymentOptions({ urls }: { urls: Partial<Record<(typeof paymentMethods)[number]['key'], string>> }) {
  return (
    <section aria-labelledby="payment-options-title" className="mt-8 border-t border-navy-100 pt-7">
      <h2 id="payment-options-title" className="text-2xl font-bold text-navy-900">Payment Options</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {paymentMethods.map(method => {
          const url = urls[method.key];
          const content = <><span aria-hidden="true" className={`flex h-14 w-14 items-center justify-center rounded-full font-black ${method.key === 'duCoin' ? 'border-4 border-emerald-200 bg-emerald-600 text-white shadow-md' : 'border border-navy-100 bg-white text-navy-900'} ${method.key === 'bitcoin' ? 'text-4xl text-amber-500' : 'text-sm'}`}>{method.mark}</span><span className="mt-2 text-center text-sm font-bold">{method.name}</span><span className="text-xs font-semibold text-navy-400">{url ? 'Secure checkout' : 'Coming Soon'}</span></>;
          return url ? (
            <a key={method.key} href={url} target="_blank" rel="noreferrer" className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-navy-100 p-3 transition hover:border-highlight-electric focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight-electric" aria-label={`${method.name} secure checkout`}>{content}</a>
          ) : (
            <div key={method.key} className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-navy-100 bg-navy-50 p-3 text-navy-600">{content}</div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-navy-400">Digital-UNI™ Coin is planned as the future primary platform currency, with transparent U.S. dollar and euro reference equivalents. It is not currently an operational payment method, stablecoin, deposit, security, or guaranteed redemption instrument. Checkout is offered only when a compliant provider has been configured.</p>
    </section>
  );
}
