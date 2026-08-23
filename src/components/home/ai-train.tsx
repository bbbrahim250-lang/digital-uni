import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const stops = ['paris', 'newYork', 'algiers', 'kualaLumpur'] as const;

export async function AiTrain({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home.aiTrain' });

  return (
    <section className="overflow-hidden bg-[#071b18] px-4 py-16 text-white" aria-labelledby="ai-train-title">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#76e39d]">{t('eyebrow')}</p>
          <h2 id="ai-train-title" className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-emerald-50/75 md:text-lg">{t('description')}</p>
        </div>

        <div className="ai-train-scene mt-10" dir="ltr" aria-label={t('animationLabel')}>
          <div className="ai-train-skyline" aria-hidden="true" />
          <div className="ai-train-route" aria-hidden="true">
            <span className="ai-train-route-glow" />
          </div>

          <div className="ai-train-vehicle" aria-hidden="true">
            <div className="ai-train-engine">
              <span className="ai-train-mark">D</span>
              <span className="ai-train-name">DIGITAL-UNI</span>
              <span className="ai-train-light" />
            </div>
            <div className="ai-train-car">
              <span className="ai-train-window">AI</span>
              <span className="ai-train-window">01</span>
              <span className="ai-train-window">∞</span>
            </div>
            <span className="ai-train-wheel ai-train-wheel-one" />
            <span className="ai-train-wheel ai-train-wheel-two" />
            <span className="ai-train-wheel ai-train-wheel-three" />
          </div>

          <div className="ai-train-stops">
            {stops.map((stop, index) => (
              <div className={`ai-train-stop ai-train-stop-${index + 1}`} key={stop}>
                <div className="ai-train-students" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <span className="ai-train-pin"><span /></span>
                <p>{t(`stops.${stop}`)}</p>
                <small>{t(`stopLabels.${stop}`)}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#52d681]/25 bg-white/[0.06] px-6 py-5 text-center sm:flex-row sm:text-start">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#57dc87] text-xl font-black text-[#062019]">Ð</span>
            <div>
              <p className="font-bold text-[#85efa9]">{t('coinName')}</p>
              <p className="text-sm text-emerald-50/65">{t('coinDescription')}</p>
            </div>
          </div>
          <div className="rounded-full border border-[#77e59b]/30 bg-[#092a22] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8cf1ae]">
            {t('coinBadge')}
          </div>
        </div>
      </div>
    </section>
  );
}
