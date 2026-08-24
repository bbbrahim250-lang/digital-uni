import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const stops = ['paris', 'newYork', 'algiers', 'kualaLumpur'] as const;

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="cinematic-hero" aria-labelledby="cinematic-hero-title">
      <video
        className="cinematic-hero-media"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/ai-train-poster.png"
        aria-hidden="true"
      >
        <source src="/videos/digital-uni-ai-train.mp4" type="video/mp4" />
      </video>

      <div className="cinematic-camera" aria-hidden="true" />
      <div className="speed-trails" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="cinematic-route" dir="ltr" aria-hidden="true">
        <div className="cinematic-train">
          <span className="train-windshield" />
          <span className="train-stripe" />
          <span className="train-wordmark">DIGITAL-UNI</span>
          <span className="train-headlight" />
        </div>
        {stops.map((stop, index) => (
          <div className={`cinematic-stop cinematic-stop-${index + 1}`} key={stop}>
            <div className="boarding-students"><i /><i /><i /></div>
            <span className="station-beacon" />
            <strong>{t(`aiTrain.stops.${stop}`)}</strong>
            <small>{t(`aiTrain.landmarks.${stop}`)}</small>
          </div>
        ))}
      </div>

      <div className="cinematic-content">
        <p className="cinematic-kicker">{t('aiTrain.eyebrow')}</p>
        <h1 id="cinematic-hero-title">DIGITAL-UNI <span>AI TRAIN</span></h1>
        <p className="cinematic-headline">{t('heroHeadline')}</p>
        <p className="cinematic-tech">{t('aiTrain.techLine')}</p>
        <p className="cinematic-cities">{t('aiTrain.citiesLine')}</p>
        <div className="cinematic-actions">
          <Link
            href={`/${locale}/enrollment`}
            className="cinematic-primary"
          >
            {t('aiTrain.enrollCta')}
          </Link>
          <Link
            href={`/${locale}/pathways`}
            className="cinematic-secondary"
          >
            {t('heroSecondaryCta')}
          </Link>
        </div>
      </div>

      <div className="digital-coin" aria-label={t('aiTrain.coinName')}>
        <span>Ð</span>
        <small>DIGITAL<br />UNI</small>
      </div>
    </section>
  );
}
