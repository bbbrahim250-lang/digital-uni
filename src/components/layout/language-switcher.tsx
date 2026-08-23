'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels, type Locale } from '@/i18n/config';

/**
 * Persists preference via the URL locale segment (cookie set by next-intl
 * middleware on navigation), per Section 6: "Persistent language preference".
 */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(locale: Locale) {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select
        value={current}
        onChange={(e) => switchTo(e.target.value as Locale)}
        className="rounded-md border border-navy-100 bg-white px-2 py-1 text-navy-900 focus-visible:outline-none"
        aria-label={label}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
