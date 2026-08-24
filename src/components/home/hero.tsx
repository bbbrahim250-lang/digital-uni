import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="poster-hero" aria-label={t('aiTrain.title')}>
      <div className="poster-hero-media" data-media-kind="poster">
        {/* This isolated media layer can be replaced with a muted, looping MP4
            when the cinematic background video is ready. */}
        <Image
          src="/images/ai-train-poster-v2.png"
          alt={t('aiTrain.posterAlt')}
          fill
          priority
          sizes="100vw"
          className="poster-hero-image"
        />
      </div>

      <div className="poster-hero-actions">
        <Link href={`/${locale}/enrollment`} className="poster-hero-primary">
          {t('aiTrain.enrollCta')}
        </Link>
        <Link href={`/${locale}/pathways`} className="poster-hero-secondary">
          {t('heroSecondaryCta')}
        </Link>
      </div>
    </section>
  );
}
