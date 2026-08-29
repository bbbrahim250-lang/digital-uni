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
type PlannerWindow = PathwayTrack | 'exploration';

const copy = {
  en: {
    kicker: 'Digital-UNI AI Train Ticket Planner',
    title: 'Choose your Executive, Professional, or Exploration journey',
    intro: 'Choose one of three Digital-AI Train windows. Executive and Professional routes create tailored certification proposals; the complimentary Exploration ticket tours available learning, financial and legal technology concepts. Do not enter identification numbers, payment details, passwords, medical records or immigration documents.',
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
    title: 'Choisissez votre parcours exécutif, professionnel ou exploratoire',
    intro: 'Choisissez l’une des trois fenêtres Digital-AI Train. Les parcours exécutif et professionnel créent une proposition de certification personnalisée; le billet d’exploration gratuit présente les concepts d’apprentissage et de technologie financière et juridique disponibles. Ne saisissez pas de pièce d’identité, données bancaires, mots de passe, dossiers médicaux ou documents d’immigration.',
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
    title: 'اختر رحلتك التنفيذية أو المهنية أو الاستكشافية',
    intro: 'اختر إحدى نوافذ قطار Digital-AI الثلاث. ينشئ المساران التنفيذي والمهني مقترحات شهادات مخصصة، وتعرض تذكرة الاستكشاف المجانية مفاهيم التعلم والتقنيات المالية والقانونية المتاحة. لا تدخل أرقام الهوية أو بيانات الدفع أو كلمات المرور أو السجلات الطبية أو وثائق الهجرة.',
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

const windowCopy = {
  en: {
    executive: 'Executive Certification',
    executiveSummary: 'Enterprise leadership and advisory pathway',
    professional: 'Professional Certification',
    professionalSummary: 'Job-ready certification pathway',
    exploration: 'Exploration Ticket',
    explorationSummary: 'Complimentary tour of Digital-UNI AI services',
    startingAt: 'Starts at',
    complimentary: 'Complimentary',
    select: 'Open this window',
    active: 'Selected window',
    trainReady: 'Digital-AI Train · route engine running',
    trainSearching: 'Digital-AI Train · searching the route',
    explorationPrompt: 'What would you like to explore?',
    explorationPlaceholder: 'Describe the library, learning pathway, case-management question, financial-audit concept, case-value factors, or legal precedent topic you want to explore.',
    explore: 'Run complimentary exploration',
    explorationReady: 'Your complimentary Digital-UNI AI Train tour pass is ready.',
    pass: 'AI Train Pass',
    paymentPass: 'RFID PAYMENT PASS · PREVIEW',
    scan: 'Scan for Digital-UNI enrollment',
    previewOnly: 'Planning preview only · No charge is collected here.',
    legalNotice: 'Exploration is educational and informational only. It does not provide legal advice, perform a certified financial audit, determine what a case is worth, predict an outcome, or create an attorney-client relationship.',
    chooseTour: 'Choose an exploration tour'
  },
  fr: {
    executive: 'Certification exécutive',
    executiveSummary: 'Parcours de leadership et de conseil en entreprise',
    professional: 'Certification professionnelle',
    professionalSummary: 'Parcours de certification prêt pour l’emploi',
    exploration: 'Billet d’exploration',
    explorationSummary: 'Visite gratuite des services IA de Digital-UNI',
    startingAt: 'À partir de',
    complimentary: 'Gratuit',
    select: 'Ouvrir cette fenêtre',
    active: 'Fenêtre sélectionnée',
    trainReady: 'Digital-AI Train · moteur de parcours actif',
    trainSearching: 'Digital-AI Train · recherche du parcours',
    explorationPrompt: 'Que souhaitez-vous explorer ?',
    explorationPlaceholder: 'Décrivez la bibliothèque, le parcours, la gestion de dossier, l’audit financier, les facteurs de valeur d’un dossier ou les précédents juridiques à explorer.',
    explore: 'Lancer l’exploration gratuite',
    explorationReady: 'Votre laissez-passer gratuit Digital-UNI AI Train est prêt.',
    pass: 'Pass AI Train',
    paymentPass: 'PASS DE PAIEMENT RFID · APERÇU',
    scan: 'Scannez pour l’inscription Digital-UNI',
    previewOnly: 'Aperçu de planification · Aucun paiement ici.',
    legalNotice: 'L’exploration est uniquement éducative et informative. Elle ne fournit pas de conseil juridique, d’audit financier certifié, de valeur définitive d’un dossier, de prédiction de résultat ou de relation avocat-client.',
    chooseTour: 'Choisissez une visite exploratoire'
  },
  ar: {
    executive: 'الشهادة التنفيذية',
    executiveSummary: 'مسار القيادة والاستشارة المؤسسية',
    professional: 'الشهادة المهنية',
    professionalSummary: 'مسار شهادة جاهز لسوق العمل',
    exploration: 'تذكرة الاستكشاف',
    explorationSummary: 'جولة مجانية في خدمات Digital-UNI للذكاء الاصطناعي',
    startingAt: 'يبدأ من',
    complimentary: 'مجاني',
    select: 'افتح هذه النافذة',
    active: 'النافذة المختارة',
    trainReady: 'قطار Digital-AI · محرك المسار يعمل',
    trainSearching: 'قطار Digital-AI · يبحث في المسار',
    explorationPrompt: 'ماذا تريد أن تستكشف؟',
    explorationPlaceholder: 'صف المكتبة أو المسار التعليمي أو إدارة القضية أو مفهوم التدقيق المالي أو عوامل قيمة القضية أو السوابق القانونية التي تريد استكشافها.',
    explore: 'ابدأ الاستكشاف المجاني',
    explorationReady: 'بطاقة جولتك المجانية على قطار Digital-UNI AI جاهزة.',
    pass: 'بطاقة قطار الذكاء الاصطناعي',
    paymentPass: 'بطاقة دفع RFID · معاينة',
    scan: 'امسح للتسجيل في Digital-UNI',
    previewOnly: 'معاينة تخطيطية فقط · لا يتم تحصيل أي مبلغ هنا.',
    legalNotice: 'الاستكشاف تعليمي وإعلامي فقط. لا يقدم استشارة قانونية أو تدقيقًا ماليًا معتمدًا، ولا يحدد قيمة القضية أو يتنبأ بالنتيجة أو ينشئ علاقة محامٍ وموكل.',
    chooseTour: 'اختر جولة استكشافية'
  }
} as const;

const explorationTopics = {
  en: [
    'Available learning library tour',
    'Court case management concepts',
    'Digital-UNI AI financial audit preview',
    'Case-value factors explorer',
    'Legal precedent research explorer'
  ],
  fr: [
    'Visite de la bibliothèque d’apprentissage',
    'Concepts de gestion des dossiers judiciaires',
    'Aperçu de l’audit financier IA Digital-UNI',
    'Exploration des facteurs de valeur d’un dossier',
    'Exploration de la recherche de précédents juridiques'
  ],
  ar: [
    'جولة في مكتبة التعلم المتاحة',
    'مفاهيم إدارة القضايا القضائية',
    'معاينة التدقيق المالي بالذكاء الاصطناعي من Digital-UNI',
    'استكشاف عوامل قيمة القضية',
    'استكشاف أبحاث السوابق القانونية'
  ]
} as const;

const windowTheme: Record<PlannerWindow, { card: string; prompt: string; ticket: string; accent: string }> = {
  executive: {
    card: 'border-emerald-400 bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 text-white',
    prompt: 'border-emerald-300/40 bg-emerald-950 text-white',
    ticket: 'from-emerald-950 via-emerald-800 to-emerald-600',
    accent: 'text-emerald-200'
  },
  professional: {
    card: 'border-slate-600 bg-gradient-to-br from-black via-navy-900 to-slate-800 text-white',
    prompt: 'border-slate-600 bg-black text-white',
    ticket: 'from-black via-navy-900 to-slate-800',
    accent: 'text-gold-400'
  },
  exploration: {
    card: 'border-amber-500 bg-gradient-to-br from-amber-950 via-[#6b3f22] to-amber-700 text-white',
    prompt: 'border-amber-500/60 bg-[#4a2b18] text-white',
    ticket: 'from-amber-950 via-[#6b3f22] to-amber-700',
    accent: 'text-amber-200'
  }
};

function AiTrainPass({
  locale,
  window,
  title,
  subject,
  fare
}: {
  locale: Locale;
  window: PlannerWindow;
  title: string;
  subject: string;
  fare: string;
}) {
  const wt = windowCopy[locale];
  const theme = windowTheme[window];
  return (
    <div className={`overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br ${theme.ticket} p-5 text-white shadow-2xl`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/60 bg-navy-900 shadow-lg">
            <Image src="/images/digital-uni-bitcoin-logo.png" alt="Digital-UNI Bitcoin logo" fill sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-black uppercase tracking-[.2em] ${theme.accent}`}>Digital-UNI</p>
            <h3 className="truncate text-xl font-black">{wt.pass}</h3>
          </div>
        </div>
        <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-black">PASS</span>
      </div>
      <div className="my-5 border-t border-dashed border-white/30" />
      <dl className="grid gap-4 sm:grid-cols-2">
        <div><dt className="text-[10px] font-black uppercase tracking-widest text-white/60">Window</dt><dd className="mt-1 font-black">{title}</dd></div>
        <div><dt className="text-[10px] font-black uppercase tracking-widest text-white/60">Fare</dt><dd className="mt-1 font-black">{fare}</dd></div>
        <div className="sm:col-span-2"><dt className="text-[10px] font-black uppercase tracking-widest text-white/60">Route / Exploration</dt><dd className="mt-1 break-words font-semibold">{subject}</dd></div>
      </dl>
      <div className="mt-5 grid items-end gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-white/70">{wt.paymentPass}</p>
          <div
            aria-label="RFID payment pass preview stripe"
            className="h-11 rounded-lg border border-white/25 bg-black/30"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,255,255,.32) 5px 7px, transparent 7px 12px)' }}
          />
          <p className="mt-2 text-[10px] text-white/65">{wt.previewOnly}</p>
        </div>
        <div className="rounded-xl bg-white p-2 text-center text-navy-900">
          <Image src="/images/enrollment-tuition-10-qr.svg" alt="QR code for Digital-UNI enrollment" width={92} height={92} className="h-[92px] w-[92px]" />
          <p className="mt-1 max-w-[92px] text-[8px] font-black uppercase leading-tight">{wt.scan}</p>
        </div>
      </div>
    </div>
  );
}

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
  const wt = windowCopy[locale];
  const [answers, setAnswers] = useState<ApplicantAnswers>(() => createInitialAnswers());
  const [plannerWindow, setPlannerWindow] = useState<PlannerWindow>('professional');
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
  const [explorationTopic, setExplorationTopic] = useState<string>(explorationTopics[locale][0]);
  const [explorationPrompt, setExplorationPrompt] = useState('');
  const [explorationRunning, setExplorationRunning] = useState(false);
  const [explorationPassReady, setExplorationPassReady] = useState(false);
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
    setPlannerWindow(track);
    setAnswers(current => ({
      ...current,
      pathwayTrack: track,
      programInterest: nextProgram,
      studyDuration: ''
    }));
    setStep(0);
    setValue('');
    setExplorationPassReady(false);
    clearGeneratedPlan();
  }

  function selectExploration() {
    setPlannerWindow('exploration');
    setExplorationPassReady(false);
    setError('');
    clearGeneratedPlan();
  }

  async function runExploration(event: FormEvent) {
    event.preventDefault();
    setExplorationRunning(true);
    setExplorationPassReady(false);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 900));
    setExplorationRunning(false);
    setExplorationPassReady(true);
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
    setPlannerWindow('professional');
    setPlan(null);
    setPlanToken('');
    setStep(0);
    setValue('');
    setResume(null);
    setConsent(false);
    setResult(null);
    setExplorationPrompt('');
    setExplorationPassReady(false);
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
  const paidWindowTitle = plannerWindow === 'executive' ? wt.executive : wt.professional;
  const activeWindowTitle = plannerWindow === 'exploration' ? wt.exploration : paidWindowTitle;
  const activeFare = plannerWindow === 'exploration' ? wt.complimentary : formatUsd(route.startingPrice);
  const activeSubject = plannerWindow === 'exploration'
    ? explorationTopic
    : plan?.recommendedProgram ?? answers.programInterest;
  const promptTheme = windowTheme[plannerWindow].prompt;
  const windowOptions: Array<{ id: PlannerWindow; title: string; summary: string; fare: string }> = [
    { id: 'executive', title: wt.executive, summary: wt.executiveSummary, fare: `${wt.startingAt} $25,000 USD` },
    { id: 'professional', title: wt.professional, summary: wt.professionalSummary, fare: `${wt.startingAt} $3,000 USD` },
    { id: 'exploration', title: wt.exploration, summary: wt.explorationSummary, fare: wt.complimentary }
  ];

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
              {plannerWindow === 'exploration' ? wt.explorationSummary : isEnabled ? t.ready : t.unavailable}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {windowOptions.map(option => {
            const selected = plannerWindow === option.id;
            const theme = windowTheme[option.id];
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => option.id === 'exploration' ? selectExploration() : selectTrack(option.id)}
                className={`group rounded-3xl border p-5 text-start shadow-lg transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-400 ${theme.card} ${selected ? 'ring-4 ring-gold-400 ring-offset-2' : ''}`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-xl font-black">{option.title}</span>
                    <span className="mt-2 block min-h-10 text-sm text-white/75">{option.summary}</span>
                  </span>
                  <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${selected ? 'animate-pulse bg-gold-400 shadow-[0_0_18px_rgba(217,181,89,.9)]' : 'bg-white/35'}`} />
                </span>
                <span className={`mt-4 block text-lg font-black ${theme.accent}`}>{option.fare}</span>
                <span className="mt-5 block rounded-2xl border border-white/20 bg-black/25 p-3">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-white/70">
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/40 bg-navy-900">
                      <Image src="/images/digital-uni-bitcoin-logo.png" alt="" fill sizes="28px" className="object-cover" />
                    </span>
                    Digital-AI Train
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:160ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:320ms]" />
                    </span>
                    {selected ? wt.active : wt.select}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {plannerWindow === 'exploration' ? (
          <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 md:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-amber-800">Digital-UNI AI Train Tour</p>
                <h3 className="mt-2 text-2xl font-black text-navy-900">{wt.exploration}</h3>
              </div>
              <p className="text-xl font-black text-amber-900">{wt.complimentary} · $0 USD</p>
            </div>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {explorationTopics[locale].map((topic, index) => (
                <li key={topic} className="rounded-2xl border border-amber-300 bg-white p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-900 text-sm font-black text-amber-200">{index + 1}</span>
                  <p className="mt-3 text-sm font-black leading-5 text-navy-900">{topic}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-widest text-amber-800">Tour stop</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-2xl border border-amber-300 bg-white p-4 text-xs leading-5 text-amber-950">{wt.legalNotice}</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {plannerWindow === 'exploration' ? (
        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <form onSubmit={runExploration} className={`min-w-0 rounded-3xl border p-5 shadow-2xl md:p-7 ${promptTheme}`}>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-amber-300 bg-navy-900 shadow-lg">
                <Image src="/images/digital-uni-bitcoin-logo.png" alt="Digital-UNI Bitcoin logo" fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-amber-200">Digital-UNI AI Train</p>
                <p aria-live="polite" className="mt-1 flex items-center gap-2 text-sm font-bold text-white/80">
                  <span className={`h-2.5 w-2.5 rounded-full bg-amber-300 ${explorationRunning ? 'animate-ping' : 'animate-pulse'}`} />
                  {explorationRunning ? wt.trainSearching : wt.trainReady}
                </p>
              </div>
            </div>
            <label className="mt-6 block font-black text-white" htmlFor="exploration-topic">
              {wt.chooseTour}
              <select
                id="exploration-topic"
                value={explorationTopic}
                onChange={event => { setExplorationTopic(event.target.value); setExplorationPassReady(false); }}
                className={inputClass}
              >
                {explorationTopics[locale].map(topic => <option key={topic}>{topic}</option>)}
              </select>
            </label>
            <label className="mt-5 block font-black text-white" htmlFor="exploration-prompt">
              {wt.explorationPrompt}
              <textarea
                id="exploration-prompt"
                rows={5}
                value={explorationPrompt}
                onChange={event => { setExplorationPrompt(event.target.value); setExplorationPassReady(false); }}
                placeholder={wt.explorationPlaceholder}
                maxLength={1500}
                className={inputClass}
              />
            </label>
            <button type="submit" disabled={explorationRunning} className="mt-5 min-h-14 w-full rounded-xl bg-amber-300 px-5 font-black text-amber-950 shadow-lg disabled:opacity-60">
              {explorationRunning ? wt.trainSearching : wt.explore}
            </button>
            <p className="mt-4 text-xs leading-5 text-amber-100/80">{wt.legalNotice}</p>
          </form>

          <div className="min-w-0 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-card md:p-7">
            <h3 className="mb-5 text-xl font-black text-navy-900">{t.preview}</h3>
            <AiTrainPass locale={locale} window="exploration" title={activeWindowTitle} subject={activeSubject} fare={activeFare} />
            {explorationPassReady ? (
              <div role="status" className="mt-5 rounded-2xl border border-amber-300 bg-white p-5 text-sm leading-6 text-navy-900">
                <p className="font-black text-amber-900">{wt.explorationReady}</p>
                <p className="mt-2"><strong>Tour:</strong> {explorationTopic}</p>
                {explorationPrompt.trim() ? <p className="mt-2"><strong>Exploration request:</strong> {explorationPrompt.trim()}</p> : null}
                <p className="mt-3 text-xs text-navy-600">{wt.legalNotice}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-amber-950">Choose a tour, write what you want the Digital-AI Train to explore, and run the complimentary ticket.</p>
            )}
          </div>
        </div>
      ) : !isEnabled ? (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center text-amber-950">
          <strong>{t.unavailable}</strong>
          <p className="mt-2 text-sm">The standard enrollment form remains available above.</p>
        </div>
      ) : (
        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-card md:p-7">
            {!plan && !result ? (
              <form onSubmit={next}>
                <div className={`rounded-2xl border p-4 ${promptTheme}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/50 bg-navy-900 shadow-md">
                      <Image
                        src="/images/digital-uni-bitcoin-logo.png"
                        alt="Digital-UNI Bitcoin logo"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/75">Digital-AI Train · OpenAI prompt · Stop {step + 1} / {fields.length}</p>
                      <p aria-live="polite" className="mt-1 flex items-center gap-2 text-xs font-semibold text-white/65">
                        <span className={`h-2 w-2 rounded-full bg-gold-400 ${busy ? 'animate-ping' : 'animate-pulse'}`} />
                        {busy ? wt.trainSearching : wt.trainReady}
                      </p>
                    </div>
                  </div>
                  <label className="mt-4 block text-lg font-bold text-white" htmlFor="assistant-answer">{questions[locale][step]}</label>
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

          <div className="min-w-0 rounded-2xl border border-navy-100 bg-navy-50 p-5 md:p-7">
            <h3 className="mb-5 text-xl font-bold">{t.preview}</h3>
            <AiTrainPass locale={locale} window={plannerWindow} title={activeWindowTitle} subject={activeSubject} fare={activeFare} />
            {plan ? (
              <div className="mt-6 space-y-4 break-words rounded-2xl bg-white p-5 text-sm">
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
          </div>
        </div>
      )}
    </section>
  );
}
