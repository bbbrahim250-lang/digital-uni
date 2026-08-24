import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <>
      <section className="poster-hero" aria-label={t('aiTrain.title')}>
        <div className="poster-hero-media" data-media-kind="poster">
          <Image
            src="/images/ai-train-poster-v2.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="poster-hero-backdrop"
          />
          <Image
            src="/images/ai-train-poster-v2.png"
            alt={t('aiTrain.posterAlt')}
            fill
            priority
            sizes="100vw"
            className="poster-hero-image"
          />
        </div>

        <p className="poster-hero-destinations">
          <span>Paris</span>
          <span>New York</span>
          <span>Algiers</span>
          <span>Kuala Lumpur</span>
          <span>AI HIGH SCHOOL — PROPOSED SANTA MONICA CIVIC CENTER SITE</span>
        </p>

        <div className="poster-hero-actions">
          <Link href={`/${locale}/enrollment`} className="poster-hero-primary">
            {t('aiTrain.enrollCta')}
          </Link>
          <Link href={`/${locale}/pathways`} className="poster-hero-secondary">
            {t('heroSecondaryCta')}
          </Link>
        </div>
      </section>

      <aside className="pathway-billboard" aria-label="Industrial Revolution 4.0 learning pathway">
        <Link href={`/${locale}/industrial-revolution-4`} className="pathway-billboard-link">
          <Image
            src="/images/industrial-revolution-4-showcase.webp"
            alt="Industrial Revolution 4.0 course pathway: AI and machine learning, cybersecurity, cryptocurrency, and blockchain"
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 100vw, 90vw"
            className="pathway-billboard-image"
          />
          <span className="pathway-billboard-cta">Explore the Industrial Revolution 4.0 pathway →</span>
        </Link>
      </aside>
    </>
  );
}
