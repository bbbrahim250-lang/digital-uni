import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { StoreCheckout } from './store-checkout';

const productConfig = [
  { key: 'studentTicket', icon: 'PASS', priceEnv: 'STORE_EXPLORATORY_STUDENT_PRICE', checkoutEnv: 'STORE_EXPLORATORY_STUDENT_CHECKOUT_URL', featured: true },
  { key: 'staffTicket', icon: 'PASS', priceEnv: 'STORE_EXPLORATORY_STAFF_PRICE', checkoutEnv: 'STORE_EXPLORATORY_STAFF_CHECKOUT_URL', featured: true },
  { key: 'sharksShirt', icon: '01', priceEnv: 'STORE_SHARKS_SHIRT_PRICE', checkoutEnv: 'STORE_SHARKS_SHIRT_CHECKOUT_URL', featured: false },
  { key: 'digitalUniShirt', icon: 'UNI', priceEnv: 'STORE_DIGITAL_UNI_SHIRT_PRICE', checkoutEnv: 'STORE_DIGITAL_UNI_SHIRT_CHECKOUT_URL', featured: false },
  { key: 'accessories', icon: 'KIT', priceEnv: 'STORE_ACCESSORIES_PRICE', checkoutEnv: 'STORE_ACCESSORIES_CHECKOUT_URL', featured: false }
] as const;

function configuredValue(name: string) {
  return process.env[name]?.trim() || undefined;
}

function configuredUrl(name: string) {
  const value = configuredValue(name);
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export default async function StorePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'storeDirectory' });
  const amazonShopUrl = configuredUrl('DIGITAL_UNI_AMAZON_SHOP_URL');
  const checkoutLabels = {
    accept: t('checkout.accept'),
    terms: t('checkout.terms'),
    checkout: t('checkout.continue'),
    acceptFirst: t('checkout.acceptFirst'),
    request: t('checkout.request')
  };

  return (
    <main className="bg-navy-50">
      <section className="bg-navy-900 px-4 py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-gold-400">{t('eyebrow')}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight md:text-7xl">{t('title')}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-navy-50/80">{t('intro')}</p>
          <div className="mt-9 max-w-3xl rounded-2xl border border-highlight-turquoise/40 bg-white/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-highlight-turquoise">{t('amazonShop.eyebrow')}</p>
            <h2 className="mt-2 text-2xl font-black">{t('amazonShop.title')}</h2>
            <p className="mt-3 text-sm leading-7 text-navy-50/75">{t('amazonShop.intro')}</p>
            {amazonShopUrl ? (
              <a href={amazonShopUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-highlight-turquoise px-5 py-3 text-sm font-black text-navy-900 transition hover:bg-white">
                {t('amazonShop.cta')}
              </a>
            ) : (
              <span className="mt-5 inline-flex rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-navy-50/75">
                {t('amazonShop.pending')}
              </span>
            )}
            <p className="mt-4 text-xs leading-5 text-navy-50/60">{t('amazonShop.notice')}</p>
          </div>
        </div>
      </section>

      <section id="exploratory-ticket" className="scroll-mt-24 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-electric">{t('ticket.eyebrow')}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black text-navy-900 md:text-5xl">{t('ticket.title')}</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-600">{t('ticket.intro')}</p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-3xl border-2 border-dashed border-gold-500 bg-white shadow-card">
              <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
                <span className="font-black tracking-wider">DIGITAL-UNI</span>
                <span className="rounded-full border border-gold-400/50 px-3 py-1 text-xs font-black text-gold-400">{t('ticket.preview')}</span>
              </div>
              <div className="p-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-highlight-electric">{t('ticket.passLabel')}</p>
                <h3 className="mt-3 text-3xl font-black text-navy-900">{t('ticket.passName')}</h3>
                <div className="mt-7 grid grid-cols-2 gap-4 border-y border-dashed border-navy-100 py-5 text-sm">
                  <div><span className="block text-xs uppercase text-navy-400">{t('ticket.holder')}</span><strong>{t('ticket.holderValue')}</strong></div>
                  <div><span className="block text-xs uppercase text-navy-400">{t('ticket.status')}</span><strong>{t('ticket.statusValue')}</strong></div>
                  <div><span className="block text-xs uppercase text-navy-400">{t('ticket.reference')}</span><strong>DU-EXP-PREVIEW</strong></div>
                  <div><span className="block text-xs uppercase text-navy-400">{t('ticket.delivery')}</span><strong>{t('ticket.deliveryValue')}</strong></div>
                </div>
                <div role="img" aria-label={t('ticket.codeAlt')} className="mt-6 flex h-16 items-end gap-1 overflow-hidden rounded-lg bg-navy-50 px-4 py-2">
                  {[65, 35, 58, 44, 70, 30, 62, 48, 67, 38, 55, 72, 42, 60, 33, 68, 50, 40, 64, 46].map((height, index) => (
                    <span key={index} aria-hidden="true" className="flex-1 bg-navy-900" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <p className="mt-4 text-xs font-bold text-red-700">{t('ticket.notValid')}</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {productConfig.filter((product) => product.featured).map((product) => {
                const price = configuredValue(product.priceEnv);
                const checkoutUrl = configuredUrl(product.checkoutEnv);
                return (
                  <article key={product.key} className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                    <span className="inline-flex rounded-full bg-highlight-electric/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-highlight-electric">{t(`products.${product.key}.type`)}</span>
                    <h3 className="mt-4 text-2xl font-black text-navy-900">{t(`products.${product.key}.title`)}</h3>
                    <p className="mt-3 text-sm leading-7 text-navy-600">{t(`products.${product.key}.description`)}</p>
                    <p className="mt-5 text-xl font-black text-gold-600">{price || t('pricePending')}</p>
                    <StoreCheckout locale={locale} checkoutUrl={checkoutUrl} labels={checkoutLabels} />
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gold-400/50 bg-gold-200/30 p-6 text-sm leading-7 text-navy-700">
            <strong className="text-navy-900">{t('ticket.issuanceTitle')}</strong> {t('ticket.issuanceNotice')}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-highlight-turquoise">{t('merch.eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-black text-navy-900 md:text-5xl">{t('merch.title')}</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-navy-600">{t('merch.intro')}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {productConfig.filter((product) => !product.featured).map((product) => {
              const price = configuredValue(product.priceEnv);
              const checkoutUrl = configuredUrl(product.checkoutEnv);
              return (
                <article key={product.key} className="overflow-hidden rounded-2xl border border-navy-100 bg-navy-50 shadow-card">
                  <div className="flex h-40 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(20,230,190,0.22),transparent_45%),linear-gradient(135deg,#0a1b31,#142f50)]">
                    <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-gold-400 bg-navy-900 text-2xl font-black text-gold-400">{product.icon}</span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-2xl font-black text-navy-900">{t(`products.${product.key}.title`)}</h3>
                    <p className="mt-3 text-sm leading-7 text-navy-600">{t(`products.${product.key}.description`)}</p>
                    <p className="mt-5 text-xl font-black text-gold-600">{price || t('pricePending')}</p>
                    <StoreCheckout locale={locale} checkoutUrl={checkoutUrl} labels={checkoutLabels} />
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-sm leading-7 text-navy-500">{t('fulfillmentNotice')}</p>
          <Link href={`/${locale}/contact`} className="mt-6 inline-flex font-bold text-highlight-electric hover:underline">{t('bulkCta')} →</Link>
        </div>
      </section>
    </main>
  );
}
