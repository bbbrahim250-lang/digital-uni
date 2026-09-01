import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { StoreCheckout } from './store-checkout';

const productConfig = [
  { key: 'studentTicket', icon: 'PASS', priceEnv: 'STORE_EXPLORATORY_STUDENT_PRICE', checkoutEnv: 'STORE_EXPLORATORY_STUDENT_CHECKOUT_URL', featured: true },
  { key: 'staffTicket', icon: 'PASS', priceEnv: 'STORE_EXPLORATORY_STAFF_PRICE', checkoutEnv: 'STORE_EXPLORATORY_STAFF_CHECKOUT_URL', featured: true }
] as const;

const campusCollections = [
  {
    key: 'santaMonica',
    envPrefix: 'SANTA_MONICA',
    image: '/images/store/ai-pioneers-sharks-santa-monica-team-shirts.png',
    accessoriesImage: '/images/store/ai-pioneers-sharks-santa-monica-accessories.png',
    equipmentImage: '/images/store/ai-pioneers-sharks-santa-monica-equipment.png',
    crest: '/images/digital-uni-ai-pioneers-sharks-santa-monica.webp',
    priceEnv: 'STORE_SANTA_MONICA_SHARKS_SHIRT_PRICE',
    checkoutEnv: 'STORE_SANTA_MONICA_SHARKS_SHIRT_CHECKOUT_URL',
    accessoriesCheckoutEnv: 'STORE_SANTA_MONICA_ACCESSORIES_CHECKOUT_URL'
  },
  {
    key: 'paloAlto',
    envPrefix: 'PALO_ALTO',
    image: '/images/store/ai-pioneers-sharks-palo-alto-team-shirts.png',
    accessoriesImage: '/images/store/ai-pioneers-sharks-palo-alto-accessories.png',
    equipmentImage: '/images/store/ai-pioneers-sharks-palo-alto-equipment.png',
    crest: '/images/digital-uni-ai-pioneers-sharks-palo-alto.webp',
    priceEnv: 'STORE_PALO_ALTO_SHARKS_SHIRT_PRICE',
    checkoutEnv: 'STORE_PALO_ALTO_SHARKS_SHIRT_CHECKOUT_URL',
    accessoriesCheckoutEnv: 'STORE_PALO_ALTO_ACCESSORIES_CHECKOUT_URL'
  }
] as const;

const teamShirts = [
  { key: 'mensFootballShirt', envKey: 'MENS_FOOTBALL_SHIRT', audience: 'mens', sport: 'football', position: '0% 0%' },
  { key: 'womensFootballShirt', envKey: 'WOMENS_FOOTBALL_SHIRT', audience: 'womens', sport: 'football', position: '100% 0%' },
  { key: 'mensBasketballShirt', envKey: 'MENS_BASKETBALL_SHIRT', audience: 'mens', sport: 'basketball', position: '0% 50%' },
  { key: 'womensBasketballShirt', envKey: 'WOMENS_BASKETBALL_SHIRT', audience: 'womens', sport: 'basketball', position: '100% 50%' },
  { key: 'mensSoccerShirt', envKey: 'MENS_SOCCER_SHIRT', audience: 'mens', sport: 'soccer', position: '0% 100%' },
  { key: 'womensSoccerShirt', envKey: 'WOMENS_SOCCER_SHIRT', audience: 'womens', sport: 'soccer', position: '100% 100%' }
] as const;

const accessories = [
  { key: 'coffeeMug', image: 'accessoriesImage', position: '100% 0%', backgroundSize: '200% 200%', aspect: 'aspect-[3/2]', defaultPrice: '$5 USD', priceEnv: 'STORE_COFFEE_MUG_PRICE', checkoutEnv: 'STORE_COFFEE_MUG_CHECKOUT_URL', sensorEligible: false },
  { key: 'cap', image: 'accessoriesImage', position: '0% 0%', backgroundSize: '200% 200%', aspect: 'aspect-[3/2]', defaultPrice: '$15 USD', priceEnv: 'STORE_CAP_PRICE', checkoutEnv: 'STORE_CAP_CHECKOUT_URL', sensorEligible: true },
  { key: 'soccerShoes', image: 'accessoriesImage', position: '0% 100%', backgroundSize: '200% 200%', aspect: 'aspect-[3/2]', defaultPrice: '$45 USD', priceEnv: 'STORE_SOCCER_SHOES_PRICE', checkoutEnv: 'STORE_SOCCER_SHOES_CHECKOUT_URL', sensorEligible: true },
  { key: 'basketballShoes', image: 'accessoriesImage', position: '100% 100%', backgroundSize: '200% 200%', aspect: 'aspect-[3/2]', defaultPrice: '$70 USD', priceEnv: 'STORE_BASKETBALL_SHOES_PRICE', checkoutEnv: 'STORE_BASKETBALL_SHOES_CHECKOUT_URL', sensorEligible: true },
  { key: 'football', image: 'equipmentImage', position: '0% 50%', backgroundSize: '300% 100%', aspect: 'aspect-[2/3]', defaultPrice: '$30 USD', priceEnv: 'STORE_FOOTBALL_PRICE', checkoutEnv: 'STORE_FOOTBALL_CHECKOUT_URL', sensorEligible: false },
  { key: 'soccerBall', image: 'equipmentImage', position: '50% 50%', backgroundSize: '300% 100%', aspect: 'aspect-[2/3]', defaultPrice: '$25 USD', priceEnv: 'STORE_SOCCER_BALL_PRICE', checkoutEnv: 'STORE_SOCCER_BALL_CHECKOUT_URL', sensorEligible: false },
  { key: 'basketball', image: 'equipmentImage', position: '100% 50%', backgroundSize: '300% 100%', aspect: 'aspect-[2/3]', defaultPrice: '$30 USD', priceEnv: 'STORE_BASKETBALL_PRICE', checkoutEnv: 'STORE_BASKETBALL_CHECKOUT_URL', sensorEligible: false }
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

function configuredUrlFrom(...names: string[]) {
  for (const name of names) {
    const value = configuredUrl(name);
    if (value) return value;
  }
  return undefined;
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
          <p className="mt-4 inline-flex rounded-full border border-gold-400/60 bg-gold-200/30 px-4 py-2 text-sm font-black text-navy-800">{t('merch.priceGuide')}</p>

          <div className="mt-8 rounded-3xl border border-emerald-700/30 bg-navy-900 p-6 text-white shadow-card md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-highlight-turquoise/40 bg-highlight-turquoise/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-highlight-turquoise">{t('smartGear.badge')}</span>
                <h3 className="mt-4 text-2xl font-black md:text-3xl">{t('smartGear.title')}</h3>
                <p className="mt-3 text-xl font-black text-gold-400">{t('smartGear.slogan')}</p>
                <p className="mt-3 text-sm leading-7 text-navy-50/75">{t('smartGear.description')}</p>
              </div>
              <div className="rounded-2xl border border-gold-400/40 bg-white/5 p-5 text-sm leading-6 text-navy-50/75 lg:max-w-md">
                <strong className="block text-gold-400">{t('smartGear.safetyTitle')}</strong>
                {t('smartGear.safetyNotice')}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-gold-400/60 bg-gradient-to-r from-emerald-950 via-navy-900 to-black p-6 text-white shadow-card md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gold-400">{t('tryouts.eyebrow')}</p>
                <h3 className="mt-3 text-2xl font-black md:text-3xl">{t('tryouts.title')}</h3>
                <p className="mt-3 text-sm leading-7 text-navy-50/80">{t('tryouts.description')}</p>
                <p className="mt-4 font-black text-highlight-turquoise">{t('tryouts.dates')}</p>
              </div>
              <Link
                href={`/${locale}/tryouts`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-xl bg-gold-500 px-6 text-center font-black text-navy-900 transition hover:bg-white"
              >
                {t('tryouts.cta')}
              </Link>
            </div>
          </div>

          {campusCollections.map((campus) => (
            <section key={campus.key} className="mt-14" aria-labelledby={`${campus.key}-store-heading`}>
              <div className="flex items-center gap-5 border-b border-navy-100 pb-6">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gold-400/40 bg-black">
                  <Image src={campus.crest} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t('catalog.campusCollection')}</p>
                  <h3 id={`${campus.key}-store-heading`} className="mt-1 text-3xl font-black text-navy-900">{t(`campuses.${campus.key}`)}</h3>
                  <p className="mt-2 text-sm text-navy-600">{t('catalog.individualNotice')}</p>
                </div>
              </div>

              <h4 className="mt-8 text-xl font-black text-navy-900">{t('catalog.teamShirts')}</h4>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {teamShirts.map((shirt) => {
                  const title = t('products.teamShirt.title', {
                    campus: t(`campuses.${campus.key}`),
                    audience: t(`audiences.${shirt.audience}`),
                    sport: t(`sports.${shirt.sport}`)
                  });
                  const price = configuredValue(`STORE_${campus.envPrefix}_${shirt.envKey}_PRICE`) || configuredValue(campus.priceEnv) || configuredValue('STORE_SHARKS_SHIRT_PRICE') || '$35 USD';
                  const checkoutUrl = configuredUrlFrom(
                    `STORE_${campus.envPrefix}_${shirt.envKey}_CHECKOUT_URL`,
                    campus.checkoutEnv,
                    'STORE_SHARKS_SHIRT_CHECKOUT_URL'
                  );

                  return (
                    <article key={shirt.key} className="overflow-hidden rounded-2xl border border-emerald-700/25 bg-white shadow-card">
                      <div
                        role="img"
                        aria-label={t('products.teamShirt.imageAlt', { title })}
                        className="aspect-square bg-black bg-no-repeat"
                        style={{ backgroundImage: `url(${campus.image})`, backgroundPosition: shirt.position, backgroundSize: '200% 300%' }}
                      />
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">{t('products.teamShirt.type')}</span>
                          <span className="inline-flex rounded-full bg-gold-200/60 px-3 py-1 text-xs font-black uppercase tracking-wider text-navy-800">{t('smartGear.eligible')}</span>
                        </div>
                        <h5 className="mt-4 text-xl font-black text-navy-900">{title}</h5>
                        <p className="mt-3 text-sm leading-7 text-navy-600">{t('products.teamShirt.description')}</p>
                        <p className="mt-5 text-xl font-black text-gold-600">{price}</p>
                        <StoreCheckout locale={locale} checkoutUrl={checkoutUrl} labels={checkoutLabels} />
                      </div>
                    </article>
                  );
                })}
              </div>

              <h4 className="mt-10 text-xl font-black text-navy-900">{t('catalog.accessoriesAndEquipment')}</h4>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {accessories.map((product) => {
                  const title = t(`products.${product.key}.title`, { campus: t(`campuses.${campus.key}`) });
                  const price = configuredValue(product.priceEnv) || product.defaultPrice;
                  const checkoutUrl = configuredUrlFrom(product.checkoutEnv, campus.accessoriesCheckoutEnv, 'STORE_ACCESSORIES_CHECKOUT_URL');

                  return (
                    <article key={product.key} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
                      <div
                        role="img"
                        aria-label={title}
                        className={`${product.aspect} bg-black bg-no-repeat`}
                        style={{
                          backgroundImage: `url(${campus[product.image]})`,
                          backgroundPosition: product.position,
                          backgroundSize: product.backgroundSize
                        }}
                      />
                      <div className="p-6">
                        {product.sensorEligible && (
                          <span className="inline-flex rounded-full bg-gold-200/60 px-3 py-1 text-xs font-black uppercase tracking-wider text-navy-800">{t('smartGear.eligible')}</span>
                        )}
                        <h5 className="mt-3 text-xl font-black text-navy-900">{title}</h5>
                        <p className="mt-3 text-sm leading-7 text-navy-600">{t(`products.${product.key}.description`)}</p>
                        <p className="mt-5 text-xl font-black text-gold-600">{price}</p>
                        <StoreCheckout locale={locale} checkoutUrl={checkoutUrl} labels={checkoutLabels} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <p className="mt-10 text-sm leading-7 text-navy-500">{t('fulfillmentNotice')}</p>
          <Link href={`/${locale}/contact`} className="mt-6 inline-flex font-bold text-highlight-electric hover:underline">{t('bulkCta')} →</Link>
        </div>
      </section>
    </main>
  );
}
