import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Card } from '@/components/ui/card';

const categoryKeys = [
  'python',
  'webdev',
  'ai',
  'ml',
  'dataScience',
  'cybersecurity',
  'cloud',
  'business',
  'certPrep'
] as const;

export async function FeaturedCategories({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl font-semibold text-navy-900">{t('featuredCategories')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {categoryKeys.map((key) => (
          <Card key={key} className="transition hover:border-gold-500">
            <p className="font-medium text-navy-900">{t(`categories.${key}`)}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
