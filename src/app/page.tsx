import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// Users hitting the bare domain are sent to their default/detected locale
// (middleware handles detection for most cases; this is the static fallback).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
