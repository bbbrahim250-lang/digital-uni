import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { TryoutApplicationForm } from './tryout-application-form';

export const dynamic = 'force-dynamic';

export default async function TryoutsPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const store = await getTranslations({ locale, namespace: 'storeDirectory' });
  const enabled = Boolean(
    process.env.APPLICANT_PLAN_SIGNING_SECRET
    && process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return (
    <main className="bg-navy-50">
      <section className="bg-gradient-to-br from-black via-emerald-950 to-navy-900 px-4 py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gold-400">{store('tryouts.eyebrow')}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">{store('tryouts.title')}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-navy-50/80">{store('tryouts.description')}</p>
          <p className="mt-5 inline-flex rounded-full border border-gold-400/60 bg-black/30 px-5 py-3 font-black text-highlight-turquoise">{store('tryouts.dates')}</p>
        </div>
      </section>
      <TryoutApplicationForm locale={locale} enabled={enabled} />
    </main>
  );
}
