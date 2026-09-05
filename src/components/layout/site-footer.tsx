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

        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <a href="mailto:enroll@digital-uni.net" className="hover:text-gold-400">enroll@digital-uni.net</a>
          <a href="mailto:financial_aid@digital-uni.net" className="hover:text-gold-400">financial_aid@digital-uni.net</a>
          <a href="https://www.linkedin.com/in/brahim-bb-600153113/" target="_blank" rel="noreferrer" className="hover:text-gold-400">Brahim-BB · LinkedIn</a>
        </div>

        <div className="mt-10 border-t border-white/15 pt-8">
          <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-white/20 shadow-2xl">
            <Image
              src="/images/brahim-bb-digital-uni-campus-card.png"
              alt="Brahim BB — Digital-UNI global campus card for Palo Alto, Santa Monica and Lycée-Paris 8"
              width={1624}
              height={920}
              sizes="(max-width: 768px) 100vw, 1152px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
