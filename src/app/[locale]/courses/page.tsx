import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StaticPage } from '@/components/layout/static-page';

const tutorLocations = [
  {
    name: 'Santa Monica–Malibu',
    detail: 'Santa Monica–Malibu schools',
  },
  {
    name: 'Palo Alto',
    detail: 'Palo Alto schools',
  },
  {
    name: 'Paris',
    detail: 'Paris 8e & surrounding schools',
  },
];

export default async function CoursesPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.courses' });

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      <section className="rounded-3xl border border-gold-400/30 bg-navy-900 p-6 shadow-xl sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">Digital-UNI AI Tutor</p>
          <h2 className="mt-2 text-3xl font-black text-white">$30/hour · All Subjects</h2>
          <p className="mt-3 text-sm leading-6 text-navy-200">
            Select your school area, then choose an in-person or remote Digital-UNI instructor.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {tutorLocations.map((location) => (
            <article key={location.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-black text-white">{location.name}</h3>
              <p className="mt-1 text-sm text-navy-300">{location.detail}</p>
              <div className="mt-5 grid gap-3">
                <Link
                  href={`/${locale}/courses/in-person-reservation?service=ai-tutor&location=${encodeURIComponent(location.name)}`}
                  className="rounded-xl bg-gold-500 px-4 py-3 text-center text-sm font-black text-navy-900 transition hover:bg-gold-400"
                >
                  Reserve In-Person Instructor
                </Link>
                <Link
                  href={`/${locale}/courses/remote-classroom-reservation?service=ai-tutor&location=${encodeURIComponent(location.name)}`}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                >
                  Reserve Remote Instructor
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
