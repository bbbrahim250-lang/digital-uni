import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { ContactForm } from '../contact/contact-form';

const copy = {
  en: ['Enrollment and account request', 'Create an enrollment/account-access request. This form does not create login credentials or claim a successful registration.'],
  fr: ["Demande d’inscription et de compte", "Créez une demande d’inscription et d’accès. Ce formulaire ne crée pas d’identifiants et ne confirme pas une inscription."],
  ar: ['طلب التسجيل والحساب', 'أنشئ طلب تسجيل ووصول إلى الحساب. لا ينشئ هذا النموذج بيانات دخول ولا يؤكد نجاح التسجيل.']
} as const;

export default function SignUpPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return <main className="mx-auto max-w-2xl px-4 py-16"><h1 className="text-3xl font-bold text-navy-900">{copy[locale][0]}</h1><p className="my-5 text-navy-600">{copy[locale][1]}</p><div className="rounded-xl border p-6"><ContactForm locale={locale} /></div><Link className="mt-6 inline-block font-semibold text-highlight-electric" href={`/${locale}/enrollment`}>View enrollment →</Link></main>;
}
