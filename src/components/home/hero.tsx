import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const stops = ['paris', 'newYork', 'algiers', 'kualaLumpur'] as const;

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  return (
    <section className="train-hero" aria-labelledby="train-hero-title">
      <video className="train-hero-media" autoPlay muted loop playsInline poster="/images/ai-train-poster.png" aria-hidden="true">
        <source src="/videos/digital-uni-ai-train.mp4" type="video/mp4" />
      </video>
      <div className="train-atmosphere" aria-hidden="true">
        <span className="speed-trail speed-trail-one" /><span className="speed-trail speed-trail-two" /><span className="speed-trail speed-trail-three" />
      </div>
      <div className="train-hero-content">
        <p className="train-kicker">{t('aiTrain.eyebrow')}</p>
        <h1 id="train-hero-title">DIGITAL-UNI <span>AI TRAIN</span></h1>
        <p className="train-headline">{t('heroHeadline')}</p>
        <p className="train-disciplines">{t('aiTrain.disciplines')}</p>
        <p className="train-cities">{t('aiTrain.cityLine')}</p>
        <div className="train-actions">
          <Link href={`/${locale}/enrollment`} className="train-primary-action">{t('aiTrain.enrollCta')}</Link>
          <Link href={`/${locale}/pathways`} className="train-secondary-action">{t('heroSecondaryCta')}</Link>
        </div>
      </div>
      <div className="cinematic-train" aria-hidden="true">
        <div className="train-nose"><span className="train-windscreen" /><b>DIGITAL-UNI</b><i /></div>
        <div className="train-carriage"><span /><span /><span /><span /></div>
      </div>
      <div className="global-route" dir="ltr" aria-label={t('aiTrain.animationLabel')}>
        <div className="route-rail" aria-hidden="true" />
        {stops.map((stop, index) => (
          <div className={`global-stop global-stop-${index + 1}`} key={stop}>
            <div className="boarding-students" aria-hidden="true"><i /><i /><i /></div>
            <span className="station-beacon" aria-hidden="true" />
            <strong>{t(`aiTrain.stops.${stop}`)}</strong><small>{t(`aiTrain.landmarks.${stop}`)}</small>
          </div>
        ))}
      </div>
      <div className="digital-coin" aria-label={t('aiTrain.coinName')}>
        <span className="coin-face">D<span>U</span></span><span><b>{t('aiTrain.coinName')}</b><small>{t('aiTrain.coinBadge')}</small></span>
      </div>
      <span className="train-scroll-cue" aria-hidden="true">⌄</span>
    </section>
  );
}
