import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const links = [
  ['copyright', 'copyright'],
  ['copyrightRemoval', 'copyright-removal'],
  ['privacy', 'privacy'],
  ['terms', 'terms'],
  ['accessibility', 'accessibility']
] as const;

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tLegal = await getTranslations({ locale, namespace: 'legal' });
  const tSite = await getTranslations({ locale, namespace: 'site' });

  return (
    <footer className="mt-16 border-t border-navy-100 bg-navy-900 text-navy-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="max-w-3xl text-sm text-navy-50/80">{tLegal('attributionNotice')}</p>
        <p className="mt-3 max-w-3xl text-sm text-navy-50/80">{tLegal('noAccreditationClaim')}</p>

        <nav aria-label={t('copyright')} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map(([key, path]) => (
            <Link key={key} href={`/${locale}/${path}`} className="hover:text-gold-400">
              {t(key)}
            </Link>
          ))}
        </nav>

        <p className="mt-6 text-xs text-navy-50/60">
          © {new Date().getFullYear()} {tSite('name')}. {t('rights')}
        </p>

        <div className="mt-10 border-t border-white/15 pt-8">
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-white/20 shadow-2xl">
            <Image
              src="/images/brahim-boumakh-digital-uni-business-card.webp"
              alt="Brahim Boumakh — Digital-UNI AI infrastructure and information technology contact information"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
            />
            <Link
              href={`/${locale}/enrollment?promo=TUITION10`}
              aria-label={t('enrollmentQr')}
              className="absolute block bg-white p-[0.5%]"
              style={{ left: '81.3%', top: '65.5%', width: '15.1%', aspectRatio: '1 / 1' }}
            >
              <Image src="/images/enrollment-tuition-10-qr.svg" alt={t('enrollmentQr')} width={256} height={256} unoptimized className="h-full w-full" />
            </Link>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-gold-200">
            <Link href={`/${locale}/enrollment?promo=TUITION10`} className="hover:text-gold-400">
              {t('tuitionDiscount')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
