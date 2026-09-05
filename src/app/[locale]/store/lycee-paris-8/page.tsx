import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const gear = [
  ['Football', '$35'], ['Basketball', '$35'], ['Soccer', '$35'], ['AI Pioneers Sharks Cap', '$15'], ['Coffee Mug', '$5'], ['Soccer Shoes', '$45'], ['Basketball Shoes', '$70']
] as const;

const copy = {
  en: { title: 'Lycée-Paris 8 Sports Gear', intro: 'Digital-UNI AI Pioneers Sharks · Lycée-Paris 8 collection for football, basketball, soccer and campus accessories.', note: 'Paris 8 merchandise is presented as a Digital-UNI concept collection. Product availability and checkout are confirmed separately.', back: 'Back to Digital-UNI Store' },
  fr: { title: 'Équipements sportifs Lycée-Paris 8', intro: 'Collection Digital-UNI AI Pioneers Sharks · Lycée-Paris 8 pour le football, le basketball, le soccer et les accessoires du campus.', note: 'Les produits Paris 8 sont présentés comme une collection concept Digital-UNI. La disponibilité et le paiement sont confirmés séparément.', back: 'Retour à la boutique Digital-UNI' },
  ar: { title: 'معدات Lycée-Paris 8 الرياضية', intro: 'مجموعة Digital-UNI AI Pioneers Sharks · Lycée-Paris 8 لكرة القدم وكرة السلة وكرة القدم العالمية وإكسسوارات المدرسة.', note: 'تُعرض منتجات Paris 8 كمجموعة تصميم من Digital-UNI، ويتم تأكيد التوفر والدفع بشكل منفصل.', back: 'العودة إلى متجر Digital-UNI' }
} as const;

export default function ParisStorePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  return (
    <main className="bg-navy-50">
      <section className="bg-navy-900 px-4 py-16 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1fr_240px]">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-gold-400">Digital-UNI AI Pioneers Sharks</p><h1 className="mt-4 text-4xl font-black md:text-6xl">{c.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-navy-50/80">{c.intro}</p></div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold-400/40 bg-black"><Image src="/images/digital-uni-ai-pioneers-shark-logo.png" alt="AI Pioneers Sharks Lycée-Paris 8" fill sizes="240px" className="object-contain" /></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{gear.map(([name, price]) => <article key={name} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card"><p className="text-xs font-black uppercase tracking-wider text-highlight-turquoise">Lycée-Paris 8</p><h2 className="mt-3 text-xl font-black text-navy-900">{name}</h2><p className="mt-4 text-lg font-black text-gold-600">{price} USD</p><span className="mt-5 inline-flex rounded-lg border border-navy-200 px-4 py-2 text-sm font-bold text-navy-500">Coming to store</span></article>)}</div>
        <p className="mt-8 rounded-2xl bg-white p-5 text-sm leading-7 text-navy-600">{c.note}</p>
        <Link href={`/${locale}/store`} className="mt-6 inline-flex font-bold text-highlight-electric hover:underline">← {c.back}</Link>
      </section>
    </main>
  );
}
