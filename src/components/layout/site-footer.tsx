import Link from 'next/link';
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
      </div>
    </footer>
  );
}
