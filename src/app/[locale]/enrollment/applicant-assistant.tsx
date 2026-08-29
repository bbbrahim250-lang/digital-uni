'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  brochureDisclaimer,
  getTicketPaymentSummary,
  getTrainPathway,
  legalProgramNotice,
  programNamesByTrack,
  ticketPaymentValues,
  type ApplicantAnswers,
  type ApplicantPlan,
  type PathwayTrack,
  type TicketPaymentPreference
} from '@/lib/applicant-planning';

type Locale = 'en' | 'ar' | 'fr';

const copy = {
  en: {
    kicker: 'Digital-UNI AI Train Ticket Planner',
    title: 'Build your professional or executive journey',
    intro: 'Choose a route, program and reservation schedule. Then answer one short question at a time. OpenAI helps tailor the proposed itinerary and brochure. Do not enter identification numbers, payment details, passwords, medical records or immigration documents.',
    professional: 'Professional Path',
    professionalSummary: '12-week job-ready certification journey',
    executive: 'Executive Path',
    executiveSummary: '6-week leadership and enterprise advisory journey',
    program: 'Choose your pathway program',
    itinerary: 'Your proposed AI Train itinerary',
    routeTicket: 'Complete-route ticket estimate',
    payment: 'Choose an advance reservation schedule',
    estimateNotice: 'Planning estimate only. No payment is collected here. Enrollment, access, installment dates and checkout require Digital-UNI review and written confirmation.',
    ready: 'OpenAI-assisted planning is ready',
    unavailable: 'The route builder is available. OpenAI brochure generation awaits secure configuration.',
    next: 'Next stop',
    edit: 'Edit Answers',
    regenerate: 'Regenerate Plan',
    approve: 'Reserve Itinerary & Generate Brochure',
    cancel: 'Cancel',
    preview: 'Live ticket and brochure preview',
    review: 'Review your proposed route before submission',
    resumeLabel: 'Attach your résumé',
    resumeHelp: 'Required PDF or DOCX file, maximum 3 MB. It is sent privately with your personalized brochure to Digital-UNI enrollment and financial aid.',
    consent: 'I explicitly consent to Digital-UNI storing and emailing this proposal and my résumé for application review. I have read the privacy and retention notice.',
    privacy: 'Data is minimized, access-restricted and retained for up to 24 months for application review unless law requires longer. Request access or deletion at enroll@digital-uni.net.',
    submitted: 'Itinerary reservation request submitted',
    download: 'Secure brochure download'
  },
  fr: {
    kicker: 'Planificateur de billets AI Train Digital-UNI',
    title: 'Construisez votre parcours professionnel ou exécutif',
    intro: 'Choisissez un parcours, un programme et un calendrier de réservation. Répondez ensuite à une courte question à la fois. OpenAI aide à personnaliser l’itinéraire et la brochure proposés. Ne saisissez pas de pièce d’identité, données bancaires, mots de passe, dossiers médicaux ou documents d’immigration.',
    professional: 'Parcours professionnel',
    professionalSummary: 'Parcours de certification de 12 semaines',
    executive: 'Parcours exécutif',
    executiveSummary: 'Parcours de leadership et conseil de 6 semaines',
    program: 'Choisissez votre programme',
    itinerary: 'Votre itinéraire AI Train proposé',
    routeTicket: 'Estimation du billet complet',
    payment: 'Choisissez un calendrier de réservation anticipée',
    estimateNotice: 'Estimation de planification uniquement. Aucun paiement n’est prélevé ici. L’inscription, l’accès, les échéances et le paiement exigent une confirmation écrite de Digital-UNI.',
    ready: 'La planification assistée par OpenAI est prête',
    unavailable: 'Le constructeur de parcours est disponible. La création de brochure par OpenAI attend la configuration sécurisée.',
    next: 'Prochain arrêt',
    edit: 'Modifier les réponses',
    regenerate: 'Régénérer le plan',
    approve: 'Réserver l’itinéraire et créer la brochure',
    cancel: 'Annuler',
    preview: 'Aperçu du billet et de la brochure',
    review: 'Vérifiez votre parcours proposé avant l’envoi',
    resumeLabel: 'Joindre votre CV',
    resumeHelp: 'Fichier PDF ou DOCX obligatoire, 3 Mo maximum. Il est envoyé de façon privée avec votre brochure aux services des inscriptions et de l’aide financière.',
    consent: 'Je consens explicitement au stockage et à l’envoi par courriel de cette proposition et de mon CV pour examen. J’ai lu l’avis de confidentialité et de conservation.',
    privacy: 'Les données minimales sont protégées et conservées jusqu’à 24 mois, sauf obligation légale. Demandez l’accès ou la suppression à enroll@digital-uni.net.',
    submitted: 'Demande de réservation de l’itinéraire envoyée',
    download: 'Télécharger la brochure sécurisée'
  },
  ar: {
    kicker: 'مخطط تذكرة قطار Digital-UNI بالذكاء الاصطناعي',
    title: 'ابنِ مسارك المهني أو التنفيذي',
    intro: 'اختر المسار والبرنامج وجدول الحجز، ثم أجب عن سؤال قصير في كل مرة. يساعد OpenAI في تخصيص خط السير والكتيب المقترحين. لا تدخل أرقام الهوية أو بيانات الدفع أو كلمات المرور أو السجلات الطبية أو وثائق الهجرة.',
    professional: 'المسار المهني',
    professionalSummary: 'رحلة شهادة مهنية لمدة 12 أسبوعًا',
    executive: 'المسار التنفيذي',
    executiveSummary: 'رحلة قيادة واستشارة مؤسسية لمدة 6 أسابيع',
    program: 'اختر برنامج المسار',
    itinerary: 'خط سير قطار الذكاء الاصطناعي المقترح',
    routeTicket: 'تقدير تذكرة المسار الكامل',
    payment: 'اختر جدول الحجز المسبق',
    estimateNotice: 'هذا تقدير تخطيطي فقط ولا يتم تحصيل أي دفعة هنا. يتطلب التسجيل والدخول ومواعيد الأقساط والدفع مراجعة Digital-UNI وتأكيدًا كتابيًا.',
    ready: 'التخطيط بمساعدة OpenAI جاهز',
    unavailable: 'منشئ المسار متاح. إنشاء الكتيب بواسطة OpenAI ينتظر الإعداد الآمن.',
    next: 'المحطة التالية',
    edit: 'تعديل الإجابات',
    regenerate: 'إعادة إنشاء الخطة',
    approve: 'حجز خط السير وإنشاء الكتيب',
    cancel: 'إلغاء',
    preview: 'معاينة التذكرة والكتيب',
    review: 'راجع المسار المقترح قبل الإرسال',
    resumeLabel: 'أرفق سيرتك الذاتية',
    resumeHelp: 'ملف PDF أو DOCX مطلوب، بحد أقصى 3 ميغابايت. يُرسل بشكل خاص مع الكتيب إلى فريقي التسجيل والمساعدة المالية.',
    consent: 'أوافق صراحة على تخزين هذا المقترح وسيرتي الذاتية وإرسالهما بالبريد لمراجعة الطلب. قرأت إشعار الخصوصية والاحتفاظ.',
    privacy: 'تُحفظ البيانات الضرورية فقط مع تقييد الوصول لمدة تصل إلى 24 شهرًا ما لم يتطلب القانون غير ذلك. لطلب الوصول أو الحذف: enroll@digital-uni.net.',
    submitted: 'تم إرسال طلب حجز خط السير',
    download: 'تنزيل الكتيب الآمن'
  }
} as const;

const questions = {
  en: ['What is your name?', 'What is your email?', 'What do you want to learn?', 'What is your current education and professional experience?', 'What career or professional outcome do you want?', 'Does this proposed route duration work, or do you need another schedule?', 'How many hours per week are available?', 'What is your tuition budget?', 'Are you requesting financial-aid information?', 'Which language do you prefer: English, Arabic, or French?'],
  fr: ['Quel est votre nom ?', 'Quelle est votre adresse e-mail ?', 'Que souhaitez-vous apprendre ?', 'Quels sont votre formation et votre expérience professionnelle ?', 'Quel résultat professionnel souhaitez-vous ?', 'La durée proposée vous convient-elle ou souhaitez-vous un autre calendrier ?', 'Combien d’heures par semaine sont disponibles ?', 'Quel est votre budget de scolarité ?', 'Demandez-vous des informations sur l’aide financière ?', 'Quelle langue préférez-vous : anglais, arabe ou français ?'],
  ar: ['ما اسمك؟', 'ما بريدك الإلكتروني؟', 'ماذا تريد أن تتعلم؟', 'ما تعليمك الحالي وخبرتك المهنية؟', 'ما النتيجة المهنية التي تريدها؟', 'هل مدة المسار المقترحة مناسبة أم تحتاج إلى جدول آخر؟', 'كم ساعة متاحة أسبوعيًا؟', 'ما ميزانية الرسوم الدراسية؟', 'هل تطلب معلومات عن المساعدة المالية؟', 'ما لغتك المفضلة: الإنجليزية أم العربية أم الفرنسية؟']
} as const;

const fields: (keyof ApplicantAnswers)[] = [
  'name', 'email', 'learningGoals', 'currentExperience', 'careerOutcome',
  'studyDuration', 'weeklyHours', 'budget', 'financialAid', 'preferredLanguage'
];

function createInitialAnswers(): ApplicantAnswers {
  return {
    name: '',
    email: '',
    pathwayTrack: 'professional',
    learningGoals: '',
    currentExperience: '',
    careerOutcome: '',
    programInterest: programNamesByTrack.professional[0]!,
    studyDuration: '',
    weeklyHours: '',
    budget: '',
    installmentPreference: 'Full route in advance',
    financialAid: false,
    preferredLanguage: 'English'
  };
}

function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US')} USD`;
}

export function ApplicantAssistant({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const t = copy[locale];
  const [answers, setAnswers] = useState<ApplicantAnswers>(() => createInitialAnswers());
  const [step, setStep] = useState(0);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [value, setValue] = useState('');
  const [plan, setPlan] = useState<ApplicantPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [planToken, setPlanToken] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<{ reference: string; brochureUrl: string } | null>(null);
  const route = useMemo(() => getTrainPathway(answers.pathwayTrack), [answers.pathwayTrack]);
  const paymentSummary = useMemo(
    () => getTicketPaymentSummary(answers.pathwayTrack, answers.installmentPreference),
    [answers.installmentPreference, answers.pathwayTrack]
  );

  function clearGeneratedPlan() {
    setPlan(null);
    setPlanToken('');
    setResult(null);
    setResume(null);
    setConsent(false);
    setError('');
  }

  function selectTrack(track: PathwayTrack) {
    const nextProgram = programNamesByTrack[track][0]!;
    setAnswers(current => ({
      ...current,
      pathwayTrack: track,
      programInterest: nextProgram,
      studyDuration: ''
    }));
    setStep(0);
    setValue('');
    clearGeneratedPlan();
  }

  function choiceValue() {
    if (step === 8) return answers.financialAid;
    if (step === 9) return answers.preferredLanguage;
    return value;
  }

  async function generate(nextAnswers = answers) {
    setBusy(true);
    setError('');
    const response = await fetch('/api/applicant-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextAnswers)
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setError(data.error);
    setPlan(data.plan);
    setPlanToken(data.planToken);
  }

  function next(event: FormEvent) {
    event.preventDefault();
    const raw = choiceValue();
    if ((typeof raw === 'string' && !raw.trim()) || (step === 1 && !/^\S+@\S+\.\S+$/.test(String(raw)))) {
      return setError('Please provide a valid answer.');
    }
    const updated = { ...answers, [fields[step]!]: raw };
    setAnswers(updated);
    setError('');
    setValue('');
    if (step === fields.length - 1) void generate(updated);
    else setStep(current => current + 1);
  }

  async function submit() {
    if (!consent || !plan || !planToken) return setError('Explicit consent and a valid plan are required.');
    if (!resume) return setError('Please attach your résumé as a PDF or DOCX file.');
    const formData = new FormData();
    formData.set('answers', JSON.stringify(answers));
    formData.set('plan', JSON.stringify(plan));
    formData.set('planToken', planToken);
    formData.set('consent', String(consent));
    formData.set('website', '');
    formData.set('resume', resume);
    setBusy(true);
    setError('');
    const response = await fetch('/api/applicant-submit', { method: 'POST', body: formData });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setError(`${data.error}${data.reference ? ` Reference: ${data.reference}` : ''}`);
    setResult(data);
  }

  function cancel() {
    setAnswers(createInitialAnswers());
    setPlan(null);
    setPlanToken('');
    setStep(0);
    setValue('');
    setResume(null);
    setConsent(false);
    setResult(null);
    setError('');
  }

  useEffect(() => {
    fetch('/api/applicant-status', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setIsEnabled(Boolean(data.enabled)))
      .catch(() => setIsEnabled(false));
  }, []);

  const availablePrograms = programNamesByTrack[answers.pathwayTrack];
  const inputClass = 'mt-3 min-h-12 w-full rounded-xl border border-navy-100 bg-white p-3 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200';

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20" aria-labelledby="assistant-title">
      <div
        className="overflow-hidden rounded-3xl bg-navy-900 bg-cover bg-center p-5 text-white shadow-2xl md:p-8"
        style={{ backgroundImage: "linear-gradient(100deg, rgba(2, 13, 29, .98), rgba(2, 48, 43, .84)), url('/images/ai-train-poster.png')" }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div
            aria-label="Digital-UNI green Bitcoin-inspired educational coin"
            className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-4 border-double border-emerald-100 bg-gradient-to-br from-emerald-300 via-emerald-600 to-emerald-950 text-center shadow-[0_0_35px_rgba(52,211,153,.65)]"
          >
            <span className="block text-4xl font-black leading-none">₿</span>
            <span className="block text-xs font-black tracking-[.22em]">DU</span>
          </div>
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.22em] text-emerald-300">{t.kicker}</p>
            <h2 id="assistant-title" className="mt-3 text-3xl font-black md:text-5xl">{t.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-navy-50">{t.intro}</p>
            <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-emerald-100 backdrop-blur">
              {isEnabled ? t.ready : t.unavailable}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {(['professional', 'executive'] as const).map(track => {
            const selected = answers.pathwayTrack === track;
            return (
              <button
                key={track}
                type="button"
                aria-pressed={selected}
                onClick={() => selectTrack(track)}
                className={`rounded-2xl border p-5 text-start transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${selected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-navy-100 bg-navy-50 hover:border-gold-400'}`}
              >
                <span className="block text-xl font-black text-navy-900">{track === 'professional' ? t.professional : t.executive}</span>
                <span className="mt-2 block text-sm text-navy-600">{track === 'professional' ? t.professionalSummary : t.executiveSummary}</span>
                <span className="mt-3 block font-black text-emerald-700">{formatUsd(getTrainPathway(track).startingPrice)} proposed starting fare</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <label className="font-bold text-navy-900">
            {t.program}
            <select
              value={answers.programInterest}
              onChange={event => {
                setAnswers(current => ({ ...current, programInterest: event.target.value as ApplicantAnswers['programInterest'] }));
                clearGeneratedPlan();
              }}
              className={inputClass}
            >
              {availablePrograms.map(program => <option key={program}>{program}</option>)}
            </select>
          </label>
          <label className="font-bold text-navy-900">
            {t.payment}
            <select
              value={answers.installmentPreference}
              onChange={event => {
                setAnswers(current => ({ ...current, installmentPreference: event.target.value as TicketPaymentPreference }));
                clearGeneratedPlan();
              }}
              className={inputClass}
            >
              {ticketPaymentValues.map(option => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-highlight-turquoise">{t.itinerary}</p>
              <h3 className="mt-2 text-2xl font-black text-navy-900">{route.label} · {route.duration}</h3>
            </div>
            <p className="text-xl font-black text-emerald-700">{t.routeTicket}: {formatUsd(route.startingPrice)}</p>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {route.segments.map(segment => (
              <li key={segment.station} className="relative rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 font-black text-gold-400">{segment.station}</span>
                <h4 className="mt-4 font-black text-navy-900">{segment.title}</h4>
                <p className="mt-2 text-sm text-navy-500">{segment.duration}</p>
                <p className="mt-3 text-lg font-black text-emerald-700">{formatUsd(segment.price)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-2xl border border-gold-400/50 bg-gold-200/30 p-5">
            <p className="font-black text-navy-900">{answers.installmentPreference}</p>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-navy-600">
              {paymentSummary.map(item => <li key={item} className="rounded-full bg-white px-3 py-2">{item}</li>)}
            </ul>
            <p className="mt-4 text-xs leading-5 text-navy-500">{t.estimateNotice}</p>
          </div>
        </div>
      </div>

      {!isEnabled ? (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center text-amber-950">
          <strong>{t.unavailable}</strong>
          <p className="mt-2 text-sm">The standard enrollment form remains available above.</p>
        </div>
      ) : (
        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-card md:p-7">
            {!plan && !result ? (
              <form onSubmit={next}>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-300 bg-navy-900 shadow-md">
                      <Image
                        src="/images/digital-uni-bitcoin-logo.png"
                        alt="Digital-UNI Bitcoin logo"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">OpenAI prompt · Stop {step + 1} / {fields.length}</p>
                  </div>
                  <label className="mt-3 block text-lg font-bold text-navy-900" htmlFor="assistant-answer">{questions[locale][step]}</label>
                  {step === 8 ? (
                    <select id="assistant-answer" value={String(answers.financialAid)} onChange={event => setAnswers(current => ({ ...current, financialAid: event.target.value === 'true' }))} className={inputClass}>
                      <option value="false">No</option><option value="true">Yes</option>
                    </select>
                  ) : step === 9 ? (
                    <select id="assistant-answer" value={answers.preferredLanguage} onChange={event => setAnswers(current => ({ ...current, preferredLanguage: event.target.value as ApplicantAnswers['preferredLanguage'] }))} className={inputClass}>
                      <option>English</option><option>Arabic</option><option>French</option>
                    </select>
                  ) : (
                    <textarea id="assistant-answer" rows={step === 1 ? 1 : 3} value={value} onChange={event => setValue(event.target.value)} className={inputClass} maxLength={1500} />
                  )}
                </div>
                <button className="mt-5 min-h-12 w-full rounded-xl bg-gold-500 px-6 font-bold text-navy-900" disabled={busy}>{busy ? '…' : t.next}</button>
              </form>
            ) : null}

            {plan && !result ? (
              <div>
                <h3 className="text-xl font-bold">{t.review}</h3>
                <p className="mt-3 text-sm">{t.estimateNotice}</p>
                <div className="mt-5 rounded-lg border border-navy-100 p-4">
                  <label className="block text-sm font-bold" htmlFor="applicant-resume">{t.resumeLabel}</label>
                  <p id="applicant-resume-help" className="mt-2 text-xs leading-5 text-navy-600">{t.resumeHelp}</p>
                  <input
                    id="applicant-resume"
                    type="file"
                    required
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    aria-describedby="applicant-resume-help"
                    onChange={event => {
                      const file = event.target.files?.[0] ?? null;
                      if (file && file.size > 3 * 1024 * 1024) {
                        event.target.value = '';
                        setResume(null);
                        setError('The résumé must be 3 MB or smaller.');
                        return;
                      }
                      setResume(file);
                      setError('');
                    }}
                    className="mt-3 block w-full text-sm file:me-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-3 file:font-bold file:text-white"
                  />
                  {resume ? <p className="mt-2 break-all text-xs font-semibold text-emerald-700">Selected: {resume.name}</p> : null}
                </div>
                <label className="mt-5 flex gap-3 rounded-lg bg-navy-50 p-4 text-sm">
                  <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="h-6 w-6 shrink-0" />
                  {t.consent}
                </label>
                <p className="mt-3 text-xs leading-5">{t.privacy}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => { setPlan(null); setPlanToken(''); setStep(0); }} className="min-h-12 rounded-lg border font-bold">{t.edit}</button>
                  <button type="button" onClick={() => void generate()} disabled={busy} className="min-h-12 rounded-lg border font-bold">{t.regenerate}</button>
                  <button type="button" onClick={() => void submit()} disabled={busy || !consent || !resume} className="min-h-14 rounded-lg bg-gold-500 px-3 font-bold disabled:opacity-50">{t.approve}</button>
                  <button type="button" onClick={cancel} className="min-h-14 rounded-lg bg-navy-100 font-bold">{t.cancel}</button>
                </div>
              </div>
            ) : null}

            {result ? (
              <div role="status" className="rounded-xl border border-green-300 bg-green-50 p-6">
                <h3 className="text-xl font-bold">{t.submitted}</h3>
                <p className="mt-2">Reference: <strong>{result.reference}</strong></p>
                <a className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-navy-900 px-5 font-bold text-white" href={result.brochureUrl} target="_blank" rel="noreferrer">{t.download}</a>
              </div>
            ) : null}
            {error ? <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
          </div>

          <details open={Boolean(plan)} className="min-w-0 rounded-2xl border border-navy-100 bg-navy-50 p-5 lg:block md:p-7">
            <summary className="cursor-pointer text-xl font-bold lg:pointer-events-none">{t.preview}</summary>
            {plan ? (
              <div className="mt-5 space-y-4 break-words text-sm">
                <h3 className="text-2xl font-bold">{plan.routeLabel}</h3>
                <p><strong>Applicant:</strong> {plan.applicantName} ({plan.applicantEmail})</p>
                <p><strong>Program:</strong> {plan.recommendedProgram}</p>
                <p><strong>Goals:</strong> {plan.learningGoals}</p>
                <p><strong>Experience:</strong> {plan.currentExperience}</p>
                <p><strong>Alternative:</strong> {plan.alternativeProgram}</p>
                <p><strong>Duration:</strong> {plan.routeDuration}</p>
                <ol className="space-y-2">
                  {plan.ticketSegments.map(segment => <li key={segment.station}><strong>Station {segment.station}:</strong> {segment.title} · {segment.duration} · {formatUsd(segment.price)}</li>)}
                </ol>
                <p><strong>Complete-route ticket estimate:</strong> {formatUsd(plan.ticketTotal)}</p>
                <p><strong>Reservation schedule:</strong> {plan.requestedInstallmentPreference}</p>
                <p><strong>Schedule:</strong> {plan.paymentSchedule.join(' · ')}</p>
                <p><strong>Skills and modules:</strong> {plan.skillsAndModules.join(' · ')}</p>
                <p><strong>Applied project:</strong> {plan.appliedProject}</p>
                <p><strong>AI application outcome:</strong> {plan.personalizedAiApplicationOutcome}</p>
                <p><strong>Stated budget:</strong> {plan.applicantBudget}</p>
                <p><strong>Financial-aid information:</strong> {plan.financialAidInquiryStatus ? 'Requested' : 'Not requested'}</p>
                <ul className="list-disc ps-5">{plan.assumptionsAndDisclaimers.map(item => <li key={item}>{item}</li>)}</ul>
                <p className="font-semibold">{legalProgramNotice}</p>
                <p className="rounded-lg border border-amber-300 bg-amber-50 p-3">{brochureDisclaimer}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-navy-500">Your validated AI Train ticket and proposal will appear here after the questions are complete.</p>
            )}
          </details>
        </div>
      )}
    </section>
  );
}
