import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: { eyebrow: 'Digital-UNI · Courses', title: 'In-Person Class Reservation', intro: 'Request a seat for an available Digital-UNI in-person class, workshop, laboratory, or approved learning session.', cta: 'Request a reservation', note: 'Submitting a request does not guarantee a seat. Digital-UNI confirms the class location, date, time, tuition or fee, capacity, and participation requirements before a reservation becomes final.' },
  fr: { eyebrow: 'Digital-UNI · Cours', title: 'Réservation de cours en présentiel', intro: 'Demandez une place pour un cours, atelier, laboratoire ou session pédagogique Digital-UNI disponible en présentiel.', cta: 'Demander une réservation', note: 'L’envoi d’une demande ne garantit pas une place. Digital-UNI confirme le lieu, la date, l’heure, les frais éventuels, la capacité et les conditions de participation avant toute réservation définitive.' },
  ar: { eyebrow: 'Digital-UNI · الدورات', title: 'حجز فصل حضوري', intro: 'اطلب مقعدًا في فصل أو ورشة أو مختبر أو جلسة تعليمية حضورية متاحة لدى Digital-UNI.', cta: 'طلب حجز', note: 'إرسال الطلب لا يضمن المقعد. تؤكد Digital-UNI الموقع والتاريخ والوقت والرسوم والسعة ومتطلبات المشاركة قبل أن يصبح الحجز نهائيًا.' }
} as const;

export default function InPersonReservationPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  return (
    <main className="bg-navy-50 px-4 py-16 md:py-24">
      <section className="mx-auto max-w-4xl rounded-3xl border border-navy-100 bg-white p-8 shadow-card md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-gold-600">{c.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black text-navy-900 md:text-6xl">{c.title}</h1>
        <p className="mt-6 text-lg leading-8 text-navy-600">{c.intro}</p>
        <Link href={`/${locale}/contact?subject=in-person-class-reservation`} className="mt-8 inline-flex rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900 hover:bg-gold-400">{c.cta}</Link>
        <p className="mt-8 rounded-2xl bg-navy-50 p-5 text-sm leading-7 text-navy-600">{c.note}</p>
      </section>
    </main>
  );
}
