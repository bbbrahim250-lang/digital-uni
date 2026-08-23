import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  // Skip API routes, static assets, and Next internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
