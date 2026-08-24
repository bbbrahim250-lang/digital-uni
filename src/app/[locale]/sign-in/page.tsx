import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { ContactForm } from '../contact/contact-form';

const copy = {
  en: ['Account access request', 'Authentication is not yet configured. Send a secure request and the Digital-UNI enrollment team will help you access your account.'],
  fr: ["Demande d’accès au compte", "L’authentification n’est pas encore configurée. Envoyez une demande sécurisée à l’équipe des inscriptions Digital-UNI."],
  ar: ['طلب الوصول إلى الحساب', 'لم تتم تهيئة المصادقة بعد. أرسل طلبًا آمنًا وسيساعدك فريق التسجيل في Digital-UNI.']
} as const;

export default function SignInPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return <main className="mx-auto max-w-2xl px-4 py-16"><h1 className="text-3xl font-bold text-navy-900">{copy[locale][0]}</h1><p className="my-5 text-navy-600">{copy[locale][1]}</p><div className="rounded-xl border p-6"><ContactForm locale={locale} /></div><Link className="mt-6 inline-block font-semibold text-highlight-electric" href={`/${locale}/sign-up`}>Create an account request →</Link></main>;
}
