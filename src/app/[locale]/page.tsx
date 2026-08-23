import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/home/hero';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { LegalNotice } from '@/components/home/legal-notice';

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <>
      <Hero locale={locale} />
      <FeaturedCategories locale={locale} />
      {/* TODO M2+: FeaturedCourses (needs course data), Pathways, Multilingual,
          CertPrep, FAA, CTE, Accreditation-roadmap sections — placeholders below */}
      <LegalNotice locale={locale} />
    </>
  );
}
