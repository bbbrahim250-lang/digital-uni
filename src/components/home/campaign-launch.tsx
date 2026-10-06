import Link from 'next/link';
import type { Locale } from '@/i18n/config';

const copy = {
  en: {
    kicker: 'Campaign launch',
    title: 'Enroll, join the community, and help shape the next Digital-UNI projects.',
    body: 'Digital-UNI is reopening the public-facing enrollment and community-support flow while advancing the NESU research workstream. Choose the action that fits you.',
    enroll: 'Enroll / Sign Up',
    community: 'Community Support & Pledges',
    nesu: 'Explore NESU',
    note: 'Community support is separate from any public election or municipal ballot process.'
  },
  fr: {
    kicker: 'Lancement de campagne',
    title: 'Inscrivez-vous, rejoignez la communauté et contribuez aux prochains projets Digital-UNI.',
    body: 'Digital-UNI relance le parcours public d’inscription et de soutien communautaire tout en poursuivant le chantier de recherche NESU. Choisissez l’action qui vous correspond.',
    enroll: 'Inscription / Créer un compte',
    community: 'Soutien communautaire & engagements',
    nesu: 'Découvrir NESU',
    note: 'Le soutien communautaire est distinct de toute élection publique ou procédure de vote municipal.'
  },
  ar: {
    kicker: 'إطلاق الحملة',
    title: 'سجّل، وانضم إلى المجتمع، وساهم في تطوير مشاريع Digital-UNI القادمة.',
    body: 'تعيد Digital-UNI فتح مسار التسجيل والدعم المجتمعي بالتوازي مع تطوير مسار أبحاث NESU. اختر المسار المناسب لك.',
    enroll: 'التسجيل / إنشاء حساب',
    community: 'الدعم المجتمعي والتعهدات',
    nesu: 'استكشف NESU',
    note: 'الدعم المجتمعي منفصل عن أي انتخابات عامة أو إجراءات اقتراع بلدية.'
  }
} as const;

export function CampaignLaunch({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="border-y border-emerald-200/70 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-200 bg-white/95 p-6 shadow-card md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{t.kicker}</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="max-w-4xl text-2xl font-black tracking-tight text-navy-900 md:text-3xl">{t.title}</h2>
            <p className="mt-3 max-w-4xl leading-7 text-navy-600">{t.body}</p>
            <p className="mt-3 text-xs font-semibold leading-5 text-navy-400">{t.note}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[35rem] lg:grid-cols-1">
            <Link href={`/${locale}/enrollment`} className="rounded-xl bg-navy-900 px-5 py-3 text-center font-black text-white transition hover:bg-navy-700">
              {t.enroll}
            </Link>
            <Link href={`/${locale}/ai-high-school#resident-support`} className="rounded-xl bg-gold-500 px-5 py-3 text-center font-black text-navy-900 transition hover:bg-gold-400">
              {t.community}
            </Link>
            <Link href={`/${locale}/nesu`} className="rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-center font-black text-emerald-950 transition hover:bg-emerald-100">
              {t.nesu}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
