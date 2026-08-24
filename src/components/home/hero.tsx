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

      <div className="cinematic-route" dir="ltr">
        <div className="train-runner" aria-hidden="true">
          <div className="train-electric-trails"><i /><i /><i /></div>
          <svg className="cinematic-train" viewBox="0 0 620 150" role="presentation">
            <defs>
              <linearGradient id="trainSilver" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" /><stop offset=".38" stopColor="#aebbc1" />
                <stop offset=".62" stopColor="#53636a" /><stop offset=".82" stopColor="#e9f3f4" />
              </linearGradient>
              <linearGradient id="trainGreen" x1="0" x2="1"><stop stopColor="#00a94f" /><stop offset=".55" stopColor="#75ff9e" /><stop offset="1" stopColor="#07883f" /></linearGradient>
              <filter id="headlightGlow"><feGaussianBlur stdDeviation="9" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path transform="translate(620 0) scale(-1 1)" d="M18 117C43 58 98 22 202 14h300c53 0 91 24 105 76l4 28H18Z" fill="url(#trainSilver)" stroke="#efffff" strokeWidth="3" />
            <path transform="translate(620 0) scale(-1 1)" d="M41 103C80 93 136 82 205 79h397l7 22H41Z" fill="url(#trainGreen)" />
            <path transform="translate(620 0) scale(-1 1)" d="M64 77c35-35 76-48 137-52l-32 49Z" fill="#092b3b" stroke="#8ffaff" strokeWidth="3" />
            <g transform="translate(620 0) scale(-1 1)" fill="#12333d" stroke="#b9faff" strokeWidth="2">
              <path d="M221 29h58v35h-68Z" /><path d="M291 29h61v35h-61Z" /><path d="M364 29h61v35h-61Z" /><path d="M437 29h55l20 35h-75Z" />
            </g>
            <text x="270" y="95" fill="#06361f" fontSize="20" fontWeight="900" letterSpacing="3">DIGITAL-UNI</text>
            <circle cx="583" cy="104" r="10" fill="#eaffff" filter="url(#headlightGlow)" />
            <path d="M594 105l96-28v52Z" fill="#8dfaff" opacity=".4" filter="url(#headlightGlow)" />
          </svg>
          <div className="train-sparks"><i /><i /><i /><i /><i /></div>
        </div>
        {stops.map((stop, index) => (
          <div className={`cinematic-stop cinematic-stop-${index + 1}`} key={stop}>
            <div className="boarding-students"><i /><i /><i /></div>
            <span className="station-beacon" />
            <strong>{t(`aiTrain.stops.${stop}`)}</strong>
            <small>{t(`aiTrain.landmarks.${stop}`)}</small>
          </div>
        ))}
        <Link className="cinematic-stop cinematic-stop-5 santa-stop" href={`/${locale}/ai-high-school`}>
          <span className="santa-pier" aria-hidden="true"><i /><i /><i /></span>
          <div className="boarding-students"><i /><i /><i /></div>
          <span className="station-beacon" />
          <strong>SANTA MONICA</strong>
          <small>AI HIGH SCHOOL</small>
        </Link>
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
