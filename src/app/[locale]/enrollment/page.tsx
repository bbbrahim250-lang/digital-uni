import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { ContactForm } from '../contact/contact-form';

export default async function EnrollmentPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { promo?: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'enrollment' });
  const legal = await getTranslations({ locale, namespace: 'legal' });
  const hasTuitionDiscount = searchParams.promo?.toUpperCase() === 'TUITION10';

  return (
    <article>
      <section className="bg-gradient-to-br from-navy-900 to-navy-600 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">Digital-UNI · Enrollment</p>
          <h1 className="mt-5 text-4xl font-bold md:text-5xl">{t('title')}</h1>
          <p className="mt-6 text-lg leading-8 text-navy-50">{t('subtitle')}</p>
          {hasTuitionDiscount && (
            <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-gold-400 bg-gold-400/10 p-6">
              <p className="text-3xl font-bold text-gold-400">{t('discountTitle')}</p>
              <p className="mt-3 text-navy-50">{t('discountExplanation')}</p>
              <p className="mt-3 text-sm font-semibold text-gold-200">TUITION10</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">{t('startTitle')}</h2>
          <p className="mt-4 leading-7 text-navy-400">{t('startDescription')}</p>
          <Link href={`/${locale}/industrial-revolution-4`} className="mt-6 inline-block font-semibold text-highlight-electric">{t('explore')} →</Link>
          <p className="mt-8 rounded-lg border border-gold-400/40 p-5 text-sm leading-6 text-navy-600">{t('discountTerms')}</p>
          <p className="mt-5 text-sm leading-6 text-navy-400">{legal('noAccreditationClaim')}</p>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
          <h2 className="mb-6 text-2xl font-bold text-navy-900">{t('requestTitle')}</h2>
          <ContactForm locale={locale} />
        </div>
      </section>
    </article>
  );
}
