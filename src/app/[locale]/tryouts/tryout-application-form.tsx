'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  tryoutPrivacyNotice,
  type TryoutApplication
} from '@/lib/tryout';

type Locale = 'en' | 'fr' | 'ar';
type FormState = Omit<TryoutApplication, 'submissionId' | 'evidenceFilename' | 'accuracyConsent' | 'privacyConsent' | 'healthAcknowledgement'> & {
  accuracyConsent: boolean;
  privacyConsent: boolean;
  healthAcknowledgement: boolean;
};

const copy = {
  en: {
    formTitle: 'Coach Selection Application',
    formIntro: 'Complete the information needed for authorized coaching review. A professional application brochure and ID will be created for your review before anything is submitted.',
    annualDates: 'Annual tryout sessions',
    june: 'June 10', november: 'November 12',
    campus: 'Campus', sport: 'Sport', session: 'Preferred tryout session',
    santaMonica: 'Santa Monica, CA', paloAlto: 'Palo Alto, CA',
    football: 'American Football', basketball: 'Basketball', soccer: 'Soccer',
    applicant: 'Student information', name: 'Full legal name', email: 'Email', phone: 'Phone', age: 'Age group',
    minor: 'Under 18', adult: '18 or older', guardianName: 'Parent or guardian name', guardianEmail: 'Parent or guardian email',
    participation: 'Participation and insurance',
    health: 'Health, accessibility, or participation notes relevant to safe tryout participation',
    healthHelp: 'Share only information needed for safe participation. Do not upload medical records or include unrelated diagnoses.',
    insurance: 'Insurance status', insured: 'Currently insured', notInsured: 'Not currently insured', privateInsurance: 'Prefer to discuss privately with authorized staff',
    provider: 'Insurance provider (optional)', last4: 'Member ID last four digits only (optional)',
    history: 'Athletic background', historyLabel: 'Teams, positions, coaches, competitions, or relevant playing experience',
    evidence: 'Résumé or short game video', evidenceHelp: 'Upload one PDF/DOCX résumé or a short MP4/MOV/WebM highlight clip, maximum 3 MB.',
    signature: 'Electronic signature', accuracy: 'I certify that the information is true and complete to the best of my knowledge.',
    privacy: 'I consent to private storage and review by authorized Digital-UNI enrollment and coaching personnel.',
    healthAck: 'I understand that this application is not medical clearance and that required clearance must be completed before participation.',
    guardianConsent: 'I confirm that a parent or guardian authorizes this application and may be contacted for verification.',
    review: 'Generate Application ID & Review Brochure', preparing: 'Preparing private review…',
    reviewTitle: 'Review your complete tryout package', reviewText: 'Nothing has been submitted. Open the brochure and the selected résumé or video, then submit personally or make changes.',
    openBrochure: 'Open professional brochure', openEvidence: 'Open résumé or game video', makeChanges: 'Make Changes', submit: 'Submit Tryout Application',
    submitted: 'Tryout application submitted for coaching review', brochure: 'Secure brochure download', emailPending: 'The application was stored, but email delivery is pending. Quote the application ID when contacting Digital-UNI.',
    unavailable: 'Secure tryout storage is not configured yet. The Store designs remain available, but applications cannot be submitted until the private database migration and environment configuration are complete.'
  },
  fr: {
    formTitle: 'Candidature à la sélection des entraîneurs',
    formIntro: 'Renseignez les informations nécessaires à la vérification autorisée. Une brochure professionnelle et un identifiant seront créés pour vérification avant tout envoi.',
    annualDates: 'Séances annuelles', june: '10 juin', november: '12 novembre', campus: 'Campus', sport: 'Sport', session: 'Séance préférée',
    santaMonica: 'Santa Monica, Californie', paloAlto: 'Palo Alto, Californie', football: 'Football américain', basketball: 'Basketball', soccer: 'Football',
    applicant: 'Informations sur l’élève', name: 'Nom légal complet', email: 'E-mail', phone: 'Téléphone', age: 'Groupe d’âge', minor: 'Moins de 18 ans', adult: '18 ans ou plus',
    guardianName: 'Nom du parent ou tuteur', guardianEmail: 'E-mail du parent ou tuteur', participation: 'Participation et assurance',
    health: 'Notes de santé, d’accessibilité ou de participation utiles à une participation sûre', healthHelp: 'Partagez uniquement les informations nécessaires à une participation sûre. Ne téléversez aucun dossier médical.',
    insurance: 'Statut d’assurance', insured: 'Actuellement assuré', notInsured: 'Pas actuellement assuré', privateInsurance: 'Préférence pour un échange privé avec le personnel autorisé',
    provider: 'Assureur (facultatif)', last4: 'Quatre derniers chiffres du numéro de membre (facultatif)', history: 'Parcours sportif', historyLabel: 'Équipes, postes, entraîneurs, compétitions ou expérience pertinente',
    evidence: 'CV ou courte vidéo de match', evidenceHelp: 'Téléversez un CV PDF/DOCX ou une courte vidéo MP4/MOV/WebM de 3 Mo maximum.', signature: 'Signature électronique',
    accuracy: 'Je certifie que les informations sont exactes et complètes au meilleur de ma connaissance.', privacy: 'Je consens au stockage privé et à la vérification par le personnel autorisé de Digital-UNI.',
    healthAck: 'Je comprends que cette candidature ne constitue pas une autorisation médicale.', guardianConsent: 'Je confirme qu’un parent ou tuteur autorise cette candidature et peut être contacté.',
    review: 'Créer l’identifiant et vérifier la brochure', preparing: 'Préparation de la vérification privée…', reviewTitle: 'Vérifiez votre dossier complet',
    reviewText: 'Rien n’a été envoyé. Ouvrez la brochure et le CV ou la vidéo, puis envoyez personnellement ou apportez des modifications.', openBrochure: 'Ouvrir la brochure professionnelle',
    openEvidence: 'Ouvrir le CV ou la vidéo', makeChanges: 'Apporter des modifications', submit: 'Envoyer la candidature', submitted: 'Candidature envoyée à la vérification des entraîneurs',
    brochure: 'Télécharger la brochure sécurisée', emailPending: 'La candidature est stockée mais l’e-mail est en attente. Indiquez l’identifiant lors de votre contact.', unavailable: 'Le stockage sécurisé des candidatures n’est pas encore configuré.'
  },
  ar: {
    formTitle: 'طلب اختيار المدرب', formIntro: 'أكمل المعلومات اللازمة للمراجعة المخوّلة. سيتم إنشاء كتيب مهني ومعرّف طلب لمراجعتك قبل إرسال أي شيء.',
    annualDates: 'جلسات الاختبار السنوية', june: '10 يونيو', november: '12 نوفمبر', campus: 'الحرم', sport: 'الرياضة', session: 'جلسة الاختبار المفضلة',
    santaMonica: 'سانتا مونيكا، كاليفورنيا', paloAlto: 'بالو ألتو، كاليفورنيا', football: 'كرة القدم الأمريكية', basketball: 'كرة السلة', soccer: 'كرة القدم',
    applicant: 'معلومات الطالب', name: 'الاسم القانوني الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف', age: 'الفئة العمرية', minor: 'أقل من 18 عامًا', adult: '18 عامًا أو أكثر',
    guardianName: 'اسم ولي الأمر', guardianEmail: 'بريد ولي الأمر', participation: 'المشاركة والتأمين', health: 'ملاحظات الصحة أو إمكانية الوصول أو المشاركة اللازمة للاختبار الآمن',
    healthHelp: 'شارك فقط ما يلزم للمشاركة الآمنة. لا ترفع سجلات طبية.', insurance: 'حالة التأمين', insured: 'مؤمّن حاليًا', notInsured: 'غير مؤمّن حاليًا', privateInsurance: 'أفضل المناقشة الخاصة مع موظف مخوّل',
    provider: 'مزود التأمين (اختياري)', last4: 'آخر أربعة أرقام فقط من رقم العضوية (اختياري)', history: 'الخلفية الرياضية', historyLabel: 'الفرق والمراكز والمدربون والمسابقات أو الخبرة ذات الصلة',
    evidence: 'سيرة ذاتية أو فيديو قصير للمباراة', evidenceHelp: 'ارفع سيرة PDF/DOCX أو مقطع MP4/MOV/WebM قصيرًا بحد أقصى 3 ميغابايت.', signature: 'التوقيع الإلكتروني',
    accuracy: 'أقر بأن المعلومات صحيحة وكاملة حسب علمي.', privacy: 'أوافق على التخزين الخاص والمراجعة من موظفي التسجيل والتدريب المخولين.', healthAck: 'أفهم أن هذا الطلب ليس تصريحًا طبيًا.',
    guardianConsent: 'أؤكد أن ولي الأمر يجيز هذا الطلب ويمكن الاتصال به للتحقق.', review: 'إنشاء معرف الطلب ومراجعة الكتيب', preparing: 'جارٍ إعداد المراجعة الخاصة…',
    reviewTitle: 'راجع حزمة الاختبار كاملة', reviewText: 'لم يتم إرسال أي شيء. افتح الكتيب والسيرة أو الفيديو ثم أرسل بنفسك أو عدّل المعلومات.', openBrochure: 'فتح الكتيب المهني',
    openEvidence: 'فتح السيرة أو الفيديو', makeChanges: 'إجراء تعديلات', submit: 'إرسال طلب الاختبار', submitted: 'أُرسل طلب الاختبار لمراجعة المدرب', brochure: 'تنزيل الكتيب الآمن',
    emailPending: 'تم تخزين الطلب لكن إرسال البريد قيد الانتظار. اذكر معرّف الطلب عند التواصل.', unavailable: 'التخزين الآمن لطلبات الاختبار غير مُعد بعد.'
  }
} as const;

const initialState: FormState = {
  campus: 'santa_monica', sport: 'football', session: 'november_12', applicantName: '', applicantEmail: '', applicantPhone: '', ageGroup: 'under_18',
  guardianName: '', guardianEmail: '', healthParticipationNotes: '', insuranceStatus: 'discuss_privately', insuranceProvider: '', insuranceMemberLast4: '', athleticHistory: '',
  signatureName: '', accuracyConsent: false, privacyConsent: false, healthAcknowledgement: false, guardianConsent: false, website: ''
};

export function TryoutApplicationForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const t = copy[locale];
  const [submissionId, setSubmissionId] = useState('');
  const [form, setForm] = useState<FormState>(initialState);
  const [evidence, setEvidence] = useState<File | null>(null);
  const [reviewToken, setReviewToken] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reviewReady, setReviewReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ reference: string; brochureUrl: string; emailDelivered: boolean } | null>(null);

  useEffect(() => setSubmissionId(crypto.randomUUID()), []);
  useEffect(() => () => {
    if (brochureUrl) URL.revokeObjectURL(brochureUrl);
    if (evidenceUrl) URL.revokeObjectURL(evidenceUrl);
  }, [brochureUrl, evidenceUrl]);

  const application = useMemo(() => evidence && submissionId ? {
    submissionId,
    ...form,
    evidenceFilename: evidence.name
  } : null, [evidence, form, submissionId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    clearReview();
    setForm(current => ({ ...current, [key]: value }));
  }

  function clearReview() {
    setReviewReady(false);
    setReviewToken('');
    setApplicationId('');
    setBrochureUrl(current => { if (current) URL.revokeObjectURL(current); return ''; });
    setEvidenceUrl(current => { if (current) URL.revokeObjectURL(current); return ''; });
  }

  async function prepareReview(event: FormEvent) {
    event.preventDefault();
    const selectedEvidence = evidence;
    if (!application || !selectedEvidence) return setError(t.evidenceHelp);
    if (application.ageGroup === 'under_18' && (!application.guardianName || !application.guardianEmail || !application.guardianConsent)) {
      return setError(t.guardianConsent);
    }
    setBusy(true); setError('');
    const response = await fetch('/api/tryout-preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(application) });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'The review brochure could not be created.' }));
      setBusy(false); return setError(data.error);
    }
    const token = response.headers.get('x-tryout-review-token') ?? '';
    const reference = response.headers.get('x-tryout-application-id') ?? '';
    const nextBrochureUrl = URL.createObjectURL(await response.blob());
    clearReview();
    setReviewToken(token); setApplicationId(reference); setBrochureUrl(nextBrochureUrl); setEvidenceUrl(URL.createObjectURL(selectedEvidence)); setReviewReady(true); setBusy(false);
  }

  async function submit() {
    if (!application || !evidence || !reviewReady || !reviewToken) return setError('Generate and review the application brochure first.');
    const data = new FormData();
    data.set('application', JSON.stringify(application)); data.set('reviewToken', reviewToken); data.set('reviewed', 'true'); data.set('evidence', evidence);
    setBusy(true); setError('');
    const response = await fetch('/api/tryout-submit', { method: 'POST', body: data });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) return setError(payload.error);
    clearReview(); setResult(payload);
  }

  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200';
  const requiredConsents = form.accuracyConsent && form.privacyConsent && form.healthAcknowledgement && (form.ageGroup === 'adult' || form.guardianConsent);

  if (!enabled) return <section className="mx-auto max-w-5xl px-4 py-16"><p role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-6 leading-7 text-amber-950">{t.unavailable}</p></section>;
  if (result) return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div role="status" className="rounded-3xl border border-emerald-300 bg-emerald-50 p-8 shadow-card">
        <h2 className="text-3xl font-black text-navy-900">{t.submitted}</h2>
        <p className="mt-4 text-lg">Application ID: <strong>{result.reference}</strong></p>
        {!result.emailDelivered ? <p className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">{t.emailPending}</p> : null}
        <a href={result.brochureUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-navy-900 px-5 font-black text-white">{t.brochure}</a>
      </div>
    </section>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <form onSubmit={prepareReview} className="rounded-3xl border border-navy-100 bg-white p-5 shadow-card md:p-8">
        <h2 className="text-3xl font-black text-navy-900">{t.formTitle}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-navy-600">{t.formIntro}</p>
        <div className="mt-6 grid gap-4 rounded-2xl bg-navy-900 p-5 text-white sm:grid-cols-2">
          <div><span className="text-xs font-black uppercase tracking-widest text-gold-400">{t.annualDates}</span><p className="mt-2 text-2xl font-black">{t.june}</p></div>
          <div><span className="text-xs font-black uppercase tracking-widest text-gold-400">{t.annualDates}</span><p className="mt-2 text-2xl font-black">{t.november}</p></div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <label className="font-bold">{t.campus}<select value={form.campus} onChange={e => update('campus', e.target.value as FormState['campus'])} className={inputClass}><option value="santa_monica">{t.santaMonica}</option><option value="palo_alto">{t.paloAlto}</option></select></label>
          <label className="font-bold">{t.sport}<select value={form.sport} onChange={e => update('sport', e.target.value as FormState['sport'])} className={inputClass}><option value="football">{t.football}</option><option value="basketball">{t.basketball}</option><option value="soccer">{t.soccer}</option></select></label>
          <label className="font-bold">{t.session}<select value={form.session} onChange={e => update('session', e.target.value as FormState['session'])} className={inputClass}><option value="june_10">{t.june}</option><option value="november_12">{t.november}</option></select></label>
        </div>

        <fieldset className="mt-8 grid gap-5 rounded-2xl border border-navy-100 p-5 md:grid-cols-2"><legend className="px-2 text-xl font-black text-navy-900">{t.applicant}</legend>
          <label className="font-bold">{t.name}<input required value={form.applicantName} onChange={e => update('applicantName', e.target.value)} className={inputClass} maxLength={160} /></label>
          <label className="font-bold">{t.email}<input required type="email" value={form.applicantEmail} onChange={e => update('applicantEmail', e.target.value)} className={inputClass} /></label>
          <label className="font-bold">{t.phone}<input required type="tel" value={form.applicantPhone} onChange={e => update('applicantPhone', e.target.value)} className={inputClass} /></label>
          <label className="font-bold">{t.age}<select value={form.ageGroup} onChange={e => update('ageGroup', e.target.value as FormState['ageGroup'])} className={inputClass}><option value="under_18">{t.minor}</option><option value="adult">{t.adult}</option></select></label>
          {form.ageGroup === 'under_18' ? <><label className="font-bold">{t.guardianName}<input required value={form.guardianName} onChange={e => update('guardianName', e.target.value)} className={inputClass} /></label><label className="font-bold">{t.guardianEmail}<input required type="email" value={form.guardianEmail} onChange={e => update('guardianEmail', e.target.value)} className={inputClass} /></label></> : null}
        </fieldset>

        <fieldset className="mt-8 grid gap-5 rounded-2xl border border-navy-100 p-5 md:grid-cols-2"><legend className="px-2 text-xl font-black text-navy-900">{t.participation}</legend>
          <label className="font-bold md:col-span-2">{t.health}<textarea value={form.healthParticipationNotes} onChange={e => update('healthParticipationNotes', e.target.value)} className={inputClass} rows={3} maxLength={1200} /><span className="mt-2 block text-xs font-normal leading-5 text-navy-500">{t.healthHelp}</span></label>
          <label className="font-bold">{t.insurance}<select value={form.insuranceStatus} onChange={e => update('insuranceStatus', e.target.value as FormState['insuranceStatus'])} className={inputClass}><option value="insured">{t.insured}</option><option value="not_insured">{t.notInsured}</option><option value="discuss_privately">{t.privateInsurance}</option></select></label>
          <label className="font-bold">{t.provider}<input value={form.insuranceProvider} onChange={e => update('insuranceProvider', e.target.value)} className={inputClass} /></label>
          <label className="font-bold">{t.last4}<input inputMode="numeric" pattern="\d{4}" value={form.insuranceMemberLast4} onChange={e => update('insuranceMemberLast4', e.target.value.replace(/\D/g, '').slice(0, 4))} className={inputClass} /></label>
        </fieldset>

        <fieldset className="mt-8 rounded-2xl border border-navy-100 p-5"><legend className="px-2 text-xl font-black text-navy-900">{t.history}</legend>
          <label className="font-bold">{t.historyLabel}<textarea required minLength={20} maxLength={3000} rows={5} value={form.athleticHistory} onChange={e => update('athleticHistory', e.target.value)} className={inputClass} /></label>
          <label className="mt-5 block font-bold">{t.evidence}<span className="mt-2 block text-xs font-normal leading-5 text-navy-500">{t.evidenceHelp}</span><input required type="file" accept=".pdf,.docx,.mp4,.mov,.webm,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/quicktime,video/webm" onChange={e => { clearReview(); const file=e.target.files?.[0]??null; if (file && file.size > 3*1024*1024) { e.target.value=''; setEvidence(null); setError(t.evidenceHelp); } else { setEvidence(file); setError(''); } }} className="mt-3 block w-full text-sm file:me-4 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-3 file:font-bold file:text-white" />{evidence ? <span className="mt-2 block break-all text-xs font-bold text-emerald-700">{evidence.name}</span> : null}</label>
        </fieldset>

        <fieldset className="mt-8 space-y-4 rounded-2xl border border-gold-400/50 bg-gold-200/20 p-5"><legend className="px-2 text-xl font-black text-navy-900">{t.signature}</legend>
          <label className="font-bold">{t.name}<input required value={form.signatureName} onChange={e => update('signatureName', e.target.value)} className={inputClass} /></label>
          <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={form.accuracyConsent} onChange={e => update('accuracyConsent', e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />{t.accuracy}</label>
          <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={form.privacyConsent} onChange={e => update('privacyConsent', e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />{t.privacy}</label>
          <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={form.healthAcknowledgement} onChange={e => update('healthAcknowledgement', e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />{t.healthAck}</label>
          {form.ageGroup === 'under_18' ? <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={form.guardianConsent} onChange={e => update('guardianConsent', e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />{t.guardianConsent}</label> : null}
          <p className="text-xs leading-5 text-navy-600">{tryoutPrivacyNotice}</p>
          <input type="text" value={form.website} onChange={e => update('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </fieldset>

        {!reviewReady ? <button type="submit" disabled={busy || !requiredConsents || !evidence || !submissionId} className="mt-8 min-h-14 w-full rounded-xl bg-gold-500 px-6 font-black text-navy-900 disabled:opacity-50">{busy ? t.preparing : t.review}</button> : (
          <div className="mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Final review · not submitted</p><h3 className="mt-2 text-2xl font-black text-navy-900">{t.reviewTitle}</h3><p className="mt-3 leading-7 text-navy-700">{t.reviewText}</p>
            <p className="mt-3 font-black text-emerald-800">Application ID: {applicationId}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><a href={brochureUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-navy-900 px-4 text-center font-bold text-white">{t.openBrochure}</a><a href={evidenceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-navy-200 bg-white px-4 text-center font-bold text-navy-900">{t.openEvidence}</a></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" onClick={clearReview} disabled={busy} className="min-h-12 rounded-xl border border-navy-200 bg-white font-bold">{t.makeChanges}</button><button type="button" onClick={() => void submit()} disabled={busy} className="min-h-12 rounded-xl bg-gold-500 px-4 font-black text-navy-900">{busy ? '…' : t.submit}</button></div>
          </div>
        )}
        {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      </form>
    </section>
  );
}
