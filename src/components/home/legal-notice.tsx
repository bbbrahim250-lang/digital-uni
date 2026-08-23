import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Card } from '@/components/ui/card';

export async function LegalNotice({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const tHome = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl font-semibold text-navy-900">{tHome('howItWorksTitle')}</h2>
      <Card className="mt-6 border-gold-500/40">
        <p className="text-sm text-navy-600">{t('attributionNotice')}</p>
        <p className="mt-3 text-sm text-navy-600">{t('noAccreditationClaim')}</p>
      </Card>
    </section>
  );
}
