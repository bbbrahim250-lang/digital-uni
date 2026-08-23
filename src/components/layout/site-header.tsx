import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { LanguageSwitcher } from './language-switcher';

const navItems = [
  ['industrialRevolution', 'industrial-revolution-4'],
  ['aiHighSchool', 'ai-high-school'],
  ['courses', 'courses'],
  ['pathways', 'pathways'],
  ['institutions', 'institutions'],
  ['certifications', 'certifications'],
  ['accreditation', 'accreditation']
] as const;

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tSite = await getTranslations({ locale, namespace: 'site' });

  return (
    <header className="border-b border-navy-100 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold">
          <span className="rounded bg-gold-500 px-2 py-1 text-xs font-bold text-navy-900">UNI</span>
          <span>{tSite('name')}</span>
        </Link>

        <nav aria-label={t('courses')} className="hidden gap-4 lg:flex">
          {navItems.map(([key, path]) => (
            <Link key={key} href={`/${locale}/${path}`} className="text-sm text-navy-50 hover:text-gold-400">
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} label={t('language')} />
          <Link
            href={`/${locale}/sign-in`}
            className="rounded-md border border-navy-100 px-3 py-1.5 text-sm hover:bg-navy-600"
          >
            {t('signIn')}
          </Link>
          <Link
            href={`/${locale}/sign-up`}
            className="rounded-md bg-gold-500 px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-gold-400"
          >
            {t('signUp')}
          </Link>
        </div>
      </div>
    </header>
  );
}
