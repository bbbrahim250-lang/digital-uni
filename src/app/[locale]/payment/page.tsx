import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { PaymentOptions } from './payment-options';

const copy = { en: ['Secure tuition payment', 'Choose a program and request a verified checkout or invoice.'], fr: ['Paiement sécurisé des frais', 'Choisissez un programme et demandez un paiement ou une facture vérifiés.'], ar: ['دفع الرسوم الآمن', 'اختر برنامجًا واطلب صفحة دفع أو فاتورة موثقة.'] } as const;
const programs = [
  ['Executive AI Leadership', 'Starting at $25,000'], ['AI for Lawyers', 'Starting at $25,000'],
  ['Judge AI and Judicial Technology', 'Starting at $25,000'], ['Court AI Clerk Assistant', 'Contact us for configured tuition'],
  ['Court AI Expert', 'Contact us for configured tuition'], ['Professional Certification Pathway', 'Starting at $3,000']
];

export default function PaymentPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound(); const locale = params.locale as Locale;
  const methods = { stripe: Boolean(process.env.STRIPE_CHECKOUT_URL), paypal: Boolean(process.env.PAYPAL_CHECKOUT_URL), crypto: Boolean(process.env.CRYPTO_CHECKOUT_URL) };
  return <main className="bg-navy-50 px-4 py-14"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-bold text-navy-900">{copy[locale][0]}</h1><p className="mt-3 text-navy-600">{copy[locale][1]}</p><div className="mt-10 grid gap-8 lg:grid-cols-2"><section className="space-y-3"><h2 className="text-2xl font-bold">Program selection</h2>{programs.map(([name, price]) => <label key={name} className="flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-4"><input type="radio" name="program" className="mt-1 h-5 w-5" /><span><strong className="block">{name}</strong>{price}</span></label>)}<div className="rounded-lg border border-gold-400 bg-white p-4"><strong>Promotion: TUITION10</strong><p className="text-sm">A 10% discount applies only to eligible Digital-UNI tuition after server-side validation. External courses, provider charges, exam fees, taxes, and excluded costs are not discounted. Your full calculation will be shown before checkout.</p></div></section><PaymentOptions locale={locale} methods={methods} /></div></div></main>;
}
