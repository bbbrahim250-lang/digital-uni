import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';

const copy = {
  en: { eyebrow: 'Digital-UNI · Remote Classroom', title: 'Remote-Classroom Reservation', intro: 'Reserve an available Digital-UNI remote class and use the approved classroom link supplied for your session.', reserve: 'Request a remote-class reservation', zoom: 'Digital-UNI Zoom', classroom: 'Digital-UNI Google Classroom', zoomDescription: 'Open the Digital-UNI Zoom entry point. Your confirmed class may use a session-specific meeting link.', classroomDescription: 'Open Google Classroom for Digital-UNI class materials, assignments, and instructor-managed access.', note: 'Classroom access is confirmed separately. Do not treat a general Zoom or Google Classroom link as proof of enrollment or admission to a particular class.' },
  fr: { eyebrow: 'Digital-UNI · Classe à distance', title: 'Réservation de classe à distance', intro: 'Réservez un cours Digital-UNI disponible à distance et utilisez le lien de classe approuvé communiqué pour votre session.', reserve: 'Demander une réservation à distance', zoom: 'Zoom Digital-UNI', classroom: 'Google Classroom Digital-UNI', zoomDescription: 'Ouvrez le point d’entrée Zoom de Digital-UNI. Le cours confirmé peut utiliser un lien de réunion propre à la session.', classroomDescription: 'Ouvrez Google Classroom pour les supports, devoirs et accès gérés par l’enseignant Digital-UNI.', note: 'L’accès au cours est confirmé séparément. Un lien général Zoom ou Google Classroom ne constitue pas une preuve d’inscription ou d’admission à un cours particulier.' },
  ar: { eyebrow: 'Digital-UNI · الفصل عن بُعد', title: 'حجز فصل عن بُعد', intro: 'احجز فصلًا متاحًا عن بُعد لدى Digital-UNI واستخدم رابط الفصل المعتمد الذي يتم تزويدك به للجلسة.', reserve: 'طلب حجز فصل عن بُعد', zoom: 'Digital-UNI Zoom', classroom: 'Digital-UNI Google Classroom', zoomDescription: 'افتح بوابة Zoom الخاصة بـ Digital-UNI. قد يستخدم الفصل المؤكد رابط اجتماع مخصصًا للجلسة.', classroomDescription: 'افتح Google Classroom لمواد Digital-UNI والواجبات والوصول الذي يديره المدرس.', note: 'يتم تأكيد الوصول إلى الفصل بشكل منفصل. لا يُعد رابط Zoom أو Google Classroom العام إثباتًا للتسجيل أو القبول في فصل محدد.' }
} as const;

export default function RemoteClassroomReservationPage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = copy[locale];
  const zoomUrl = process.env.NEXT_PUBLIC_DIGITAL_UNI_ZOOM_URL || 'https://zoom.us/';
  const classroomUrl = process.env.NEXT_PUBLIC_DIGITAL_UNI_GOOGLE_CLASSROOM_URL || 'https://classroom.google.com/';
  return (
    <main className="bg-navy-50 px-4 py-16 md:py-24">
      <section className="mx-auto max-w-5xl rounded-3xl border border-navy-100 bg-white p-8 shadow-card md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-highlight-turquoise">{c.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black text-navy-900 md:text-6xl">{c.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-600">{c.intro}</p>
        <Link href={`/${locale}/contact?subject=remote-classroom-reservation`} className="mt-8 inline-flex rounded-xl bg-gold-500 px-6 py-3.5 font-black text-navy-900 hover:bg-gold-400">{c.reserve}</Link>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <a href={zoomUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-navy-100 p-6 transition hover:border-highlight-turquoise hover:bg-navy-50">
            <h2 className="text-xl font-black text-navy-900">{c.zoom}</h2>
            <p className="mt-3 text-sm leading-7 text-navy-600">{c.zoomDescription}</p>
          </a>
          <a href={classroomUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-navy-100 p-6 transition hover:border-highlight-turquoise hover:bg-navy-50">
            <h2 className="text-xl font-black text-navy-900">{c.classroom}</h2>
            <p className="mt-3 text-sm leading-7 text-navy-600">{c.classroomDescription}</p>
          </a>
        </div>
        <p className="mt-8 rounded-2xl bg-navy-50 p-5 text-sm leading-7 text-navy-600">{c.note}</p>
      </section>
    </main>
  );
}
