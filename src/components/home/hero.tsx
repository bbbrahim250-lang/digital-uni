import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { CinematicPathway } from './cinematic-pathway';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <CinematicPathway
      locale={locale}
      eyebrow={t('aiTrain.eyebrow')}
      headline={t('heroHeadline')}
      enrollLabel={t('aiTrain.enrollCta')}
      pathwaysLabel={t('heroSecondaryCta')}
    />
  );
}
