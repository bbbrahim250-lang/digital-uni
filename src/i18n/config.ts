export const locales = ['en', 'ar', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  fr: 'ltr'
};

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français'
};

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
