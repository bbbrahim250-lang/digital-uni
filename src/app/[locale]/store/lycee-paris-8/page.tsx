import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const gear = [
  ['Lycée-Paris 8 Hoodie', '€65'],
  ['Lycée-Paris 8 T-Shirt', '€35'],
  ['Lycée-Paris 8 Track Jacket', '€75'],
  ['Lycée-Paris 8 Backpack', '€55'],
  ['Lycée-Paris 8 Cap', '€30']
] as const;

const copy = {
  en: { title: 'Lycée-Paris 8 Sports Gear', intro: 'Digital-UNI AI Pioneers Sharks · Lycée-Paris 8 sports and campus collection, presented in euros.', note: 'Paris 8 merchandise is presented as a Digital-UNI concept collection. Product availability and checkout are confirmed separately.', back: 'Back to Digital-UNI Store' },
  fr: { title: 'Équipements sportifs Lycée-Paris 8', intro: 'Collection sportive et campus Digital-UNI AI Pioneers Sharks · Lycée-Paris 8, présentée en euros.', note: 'Les produits Paris 8 sont présentés comme une collection concept Digital-UNI. La disponibilité et le paiement sont confirmés séparément.', back: 'Retour à la boutique Digital-UNI' },
  ar: { title: 'معدات Lycée-Paris 8 الرياضية', intro: 'مجموعة Digital-UNI AI Pioneers Sharks الرياضية والمدرسية الخاصة بـ Lycée-Paris 8، مع الأسعار باليورو.', note: 'تُعرض منتجات Paris 8 كمجموعة تصميم من Digital-UNI، ويتم تأكيد التوفر والدفع بشكل منفصل.', back: 'العودة إلى متجر Digital-UNI' }
} as const;

export default function ParisStorePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  return (
    <main className="bg-navy-50">
      <section className="bg-navy-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gold-400">Digital-UNI AI Pioneers Sharks</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">{c.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-navy-50/80">{c.intro}</p>
          <div className="relative mt-9 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl">
            <Image src="/images/lycee-paris-8-sports-gear.png" alt="Digital-UNI AI Lycée-Paris 8 Sports Gear collection poster" fill priority sizes="(max-width: 1200px) 100vw, 1152px" className="object-contain" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gear.map(([name, price]) => (
            <article key={name} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <p className="text-xs font-black uppercase tracking-wider text-highlight-turquoise">Lycée-Paris 8</p>
              <h2 className="mt-3 text-xl font-black text-navy-900">{name}</h2>
              <p className="mt-4 text-lg font-black text-gold-600">{price}</p>
              <span className="mt-5 inline-flex rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-500">Coming to store</span>
            </article>
          ))}
        </div>
        <p className="mt-8 rounded-2xl bg-white p-5 text-sm leading-7 text-navy-600">{c.note}</p>
        <Link href={`/${locale}/store`} className="mt-6 inline-flex font-bold text-highlight-electric hover:underline">← {c.back}</Link>
      </section>
    </main>
  );
}
