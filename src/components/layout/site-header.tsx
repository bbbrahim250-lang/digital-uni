import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import {
  campusDirectoryItems,
  campusSupportItems,
  certificationDirectoryItems,
  institutionDirectoryItems,
  streamingStudioItems
} from '@/lib/site-directories';
import { LanguageSwitcher } from './language-switcher';

const directNavItems = [
  ['industrialRevolution', 'industrial-revolution-4'],
  ['courses', 'courses'],
  ['pathways', 'pathways'],
  ['accreditation', 'accreditation']
] as const;

type DropdownItem = {
  href: string;
  label: string;
  description: string;
};

function NavigationDropdown({ label, overview, items }: { label: string; overview: DropdownItem; items: DropdownItem[] }) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1.5 text-sm text-navy-50 transition hover:bg-white/10 hover:text-gold-400 [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden="true" className="text-[10px] transition group-open:rotate-180">▼</span>
      </summary>
      <div className="absolute start-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 text-navy-900 shadow-2xl">
        <Link href={overview.href} className="block rounded-xl bg-navy-50 px-4 py-3 transition hover:bg-gold-200/50">
          <span className="block text-sm font-bold">{overview.label}</span>
          <span className="mt-1 block text-xs leading-5 text-navy-400">{overview.description}</span>
        </Link>
        <div className="mt-1 max-h-[28rem] overflow-y-auto">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 transition hover:bg-navy-50">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-0.5 block text-xs leading-5 text-navy-400">{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}

function MobileNavigation({
  label,
  directItems,
  campuses,
  institutions,
  certifications,
  studios,
  sectionLabels,
  signIn
}: {
  label: string;
  directItems: Array<{ href: string; label: string }>;
  campuses: DropdownItem[];
  institutions: DropdownItem[];
  certifications: DropdownItem[];
  studios: DropdownItem[];
  sectionLabels: { campuses: string; institutions: string; certifications: string; studios: string };
  signIn: { href: string; label: string };
}) {
  const sections = [
    [sectionLabels.campuses, campuses],
    [sectionLabels.institutions, institutions],
    [sectionLabels.certifications, certifications],
    [sectionLabels.studios, studios]
  ] as const;

  return (
    <details className="group relative xl:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md border border-white/25 px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {label} <span aria-hidden="true" className="text-[10px] transition group-open:rotate-180">▼</span>
      </summary>
      <div className="absolute end-0 z-50 mt-2 max-h-[75vh] w-[min(22rem,88vw)] overflow-y-auto rounded-2xl border border-navy-100 bg-white p-3 text-navy-900 shadow-2xl">
        <div className="grid grid-cols-2 gap-2 border-b border-navy-100 pb-3">
          {directItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg bg-navy-50 px-3 py-2 text-sm font-semibold hover:bg-gold-200/50">
              {item.label}
            </Link>
          ))}
        </div>
        {sections.map(([sectionLabel, items]) => (
          <section key={sectionLabel} className="border-b border-navy-100 py-3 last:border-0">
            <h2 className="px-2 text-xs font-black uppercase tracking-[0.15em] text-gold-600">{sectionLabel}</h2>
            <div className="mt-2 grid gap-1">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-2 py-2 text-sm hover:bg-navy-50">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
        <Link href={signIn.href} className="mt-2 block rounded-lg border border-navy-100 px-3 py-2 text-center text-sm font-semibold sm:hidden">
          {signIn.label}
        </Link>
      </div>
    </details>
  );
}

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [t, tSite, tCampus, tInstitutions, tCertifications, tStudios] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'site' }),
    getTranslations({ locale, namespace: 'campusDirectory' }),
    getTranslations({ locale, namespace: 'institutionDirectory' }),
    getTranslations({ locale, namespace: 'certificationDirectory' }),
    getTranslations({ locale, namespace: 'studioDirectory' })
  ]);

  const directItems = directNavItems.map(([key, path]) => ({
    href: `/${locale}/${path}`,
    label: t(key)
  }));
  const campuses = [...campusDirectoryItems, ...campusSupportItems].map(({ key, href }) => ({
    href: `/${locale}/${href}`,
    label: tCampus(`items.${key}.title`),
    description: tCampus(`items.${key}.short`)
  }));
  const institutions = institutionDirectoryItems.map(({ key, anchor }) => ({
    href: `/${locale}/institutions#${anchor}`,
    label: tInstitutions(`items.${key}.title`),
    description: tInstitutions(`items.${key}.short`)
  }));
  const certifications = certificationDirectoryItems.map(({ key, anchor }) => ({
    href: `/${locale}/certifications#${anchor}`,
    label: tCertifications(`items.${key}.title`),
    description: tCertifications(`items.${key}.short`)
  }));
  const studios = streamingStudioItems.map(({ key, anchor }) => ({
    href: `/${locale}/ai-studios#${anchor}`,
    label: tStudios(`items.${key}.title`),
    description: tStudios(`items.${key}.short`)
  }));

  return (
    <header className="border-b border-navy-100 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold">
          <span className="rounded bg-gold-500 px-2 py-1 text-xs font-bold text-navy-900">UNI</span>
          <span>{tSite('name')}</span>
        </Link>

        <nav aria-label={t('primaryNavigation')} className="hidden items-center gap-1 xl:flex">
          <Link href={directItems[0]!.href} className="rounded-md px-2 py-1.5 text-sm text-navy-50 hover:bg-white/10 hover:text-gold-400">{directItems[0]!.label}</Link>
          <NavigationDropdown
            label={t('aiHighSchool')}
            overview={{ href: `/${locale}/ai-high-school#campus-selector`, label: tCampus('chooseTitle'), description: tCampus('chooseShort') }}
            items={campuses}
          />
          {directItems.slice(1, 3).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2 py-1.5 text-sm text-navy-50 hover:bg-white/10 hover:text-gold-400">{item.label}</Link>
          ))}
          <NavigationDropdown
            label={t('institutions')}
            overview={{ href: `/${locale}/institutions`, label: tInstitutions('title'), description: tInstitutions('menuDescription') }}
            items={institutions}
          />
          <NavigationDropdown
            label={t('certifications')}
            overview={{ href: `/${locale}/certifications`, label: tCertifications('title'), description: tCertifications('menuDescription') }}
            items={certifications}
          />
          <Link href={directItems[3]!.href} className="rounded-md px-2 py-1.5 text-sm text-navy-50 hover:bg-white/10 hover:text-gold-400">{directItems[3]!.label}</Link>
          <NavigationDropdown
            label={t('aiStudios')}
            overview={{ href: `/${locale}/ai-studios`, label: tStudios('title'), description: tStudios('menuDescription') }}
            items={studios}
          />
        </nav>

        <div className="flex items-center gap-3">
          <MobileNavigation
            label={t('explore')}
            directItems={directItems}
            campuses={campuses}
            institutions={institutions}
            certifications={certifications}
            studios={studios}
            sectionLabels={{ campuses: t('aiHighSchool'), institutions: t('institutions'), certifications: t('certifications'), studios: t('aiStudios') }}
            signIn={{ href: `/${locale}/sign-in`, label: t('signIn') }}
          />
          <LanguageSwitcher current={locale} label={t('language')} />
          <Link
            href={`/${locale}/sign-in`}
            className="hidden rounded-md border border-navy-100 px-3 py-1.5 text-sm hover:bg-navy-600 sm:inline-flex"
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
