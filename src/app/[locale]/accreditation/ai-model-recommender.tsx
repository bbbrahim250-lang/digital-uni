'use client';

import { useMemo, useState } from 'react';

type Locale = 'en' | 'fr' | 'ar';
type AppType = 'education' | 'commerce' | 'operations' | 'regulated' | 'media' | 'voice' | 'developer' | 'private';
type Priority = 'quality' | 'cost' | 'speed' | 'privacy';

type Recommendation = { family: string; role: string; reason: string };

const copy = {
  en: {
    eyebrow: 'Model recommendation layer', title: 'Choose models for the business application—not by popularity',
    intro: 'Select the commercial app and its main constraint. The Lab proposes a model stack to evaluate with real data, cost tests, privacy review, and human approval before production.',
    app: 'Commercial application', priority: 'Primary decision factor', result: 'Recommended evaluation stack',
    resultNote: 'This is a starting recommendation. Final selection requires task-specific evaluations, provider availability, security review, and measured production cost.',
    catalog: 'Catalog coverage', catalogText: 'The decision layer can compare connected and approved models across OpenAI, Anthropic, Google, Meta, Mistral, and specialized/open-source providers. The available catalog should be refreshed from provider model APIs rather than frozen to old version names.',
    appOptions: { education: 'Education and training', commerce: 'E-commerce and customer growth', operations: 'Business operations assistant', regulated: 'Legal, finance, or regulated workflow', media: 'Image, video, and advertising studio', voice: 'Voice and multilingual assistant', developer: 'Software product and coding platform', private: 'Private enterprise / local deployment' },
    priorities: { quality: 'Best evaluated quality', cost: 'Lower operating cost', speed: 'Fast user response', privacy: 'Privacy and deployment control' }
  },
  fr: {
    eyebrow: 'Couche de recommandation', title: 'Choisir les modèles pour l’application, pas selon leur popularité',
    intro: 'Sélectionnez l’application commerciale et sa contrainte principale. Le laboratoire propose une pile à évaluer avec données réelles, coûts, confidentialité et validation humaine.',
    app: 'Application commerciale', priority: 'Facteur de décision principal', result: 'Pile recommandée à évaluer',
    resultNote: 'Point de départ uniquement. La sélection finale exige des évaluations propres aux tâches, la disponibilité, la sécurité et le coût réel.',
    catalog: 'Couverture du catalogue', catalogText: 'La couche compare les modèles connectés et approuvés d’OpenAI, Anthropic, Google, Meta, Mistral et des fournisseurs spécialisés ou open source. Le catalogue doit être actualisé depuis les API des fournisseurs.',
    appOptions: { education: 'Éducation et formation', commerce: 'Commerce et croissance client', operations: 'Assistant des opérations', regulated: 'Juridique, finance ou secteur réglementé', media: 'Studio image, vidéo et publicité', voice: 'Assistant vocal multilingue', developer: 'Produit logiciel et plateforme de code', private: 'Entreprise privée / déploiement local' },
    priorities: { quality: 'Meilleure qualité évaluée', cost: 'Coût opérationnel réduit', speed: 'Réponse rapide', privacy: 'Confidentialité et contrôle' }
  },
  ar: {
    eyebrow: 'طبقة توصية النماذج', title: 'اختر النماذج وفق التطبيق التجاري وليس وفق الشهرة',
    intro: 'اختر نوع التطبيق التجاري وأهم قيد له. يقترح المختبر مجموعة نماذج لتقييمها ببيانات حقيقية واختبارات تكلفة ومراجعة خصوصية وموافقة بشرية.',
    app: 'التطبيق التجاري', priority: 'عامل القرار الرئيسي', result: 'مجموعة التقييم المقترحة',
    resultNote: 'هذه نقطة بداية فقط. يتطلب الاختيار النهائي تقييمات خاصة بالمهمة وتوفر المزود ومراجعة الأمن والتكلفة الفعلية.',
    catalog: 'تغطية الكتالوج', catalogText: 'تقارن الطبقة النماذج المتصلة والمعتمدة من OpenAI وAnthropic وGoogle وMeta وMistral والمزودين المتخصصين أو المفتوحين. يجب تحديث الكتالوج من واجهات المزودين بدل تثبيت أسماء إصدارات قديمة.',
    appOptions: { education: 'التعليم والتدريب', commerce: 'التجارة ونمو العملاء', operations: 'مساعد عمليات الأعمال', regulated: 'القانون أو المال أو العمل المنظم', media: 'استوديو الصور والفيديو والإعلان', voice: 'مساعد صوتي متعدد اللغات', developer: 'منتج برمجي ومنصة تطوير', private: 'مؤسسة خاصة / نشر محلي' },
    priorities: { quality: 'أفضل جودة مقاسة', cost: 'تكلفة تشغيل أقل', speed: 'استجابة سريعة', privacy: 'الخصوصية والتحكم في النشر' }
  }
} as const;

const recommendations: Record<AppType, Recommendation[]> = {
  education: [
    { family: 'OpenAI', role: 'Adaptive tutor and structured assessment', reason: 'Evaluate reasoning, tool use, safe structured outputs, and multilingual guidance.' },
    { family: 'Anthropic Claude', role: 'Long-form curriculum and critique', reason: 'Evaluate long-context reading, clear writing, feedback quality, and policy review.' },
    { family: 'Google Gemini', role: 'Multimodal lesson and media understanding', reason: 'Evaluate image, video, audio, document, and classroom-media workflows.' }
  ],
  commerce: [
    { family: 'OpenAI', role: 'Customer journey and commerce agent', reason: 'Evaluate tool calling, structured product actions, reasoning, and reliable handoffs.' },
    { family: 'Google Gemini', role: 'Visual merchandise and campaign analysis', reason: 'Evaluate multimodal product understanding and creative campaign workflows.' },
    { family: 'Specialized embeddings / reranking', role: 'Search and recommendations', reason: 'Benchmark catalog retrieval, ranking quality, latency, and unit economics.' }
  ],
  operations: [
    { family: 'OpenAI + Codex', role: 'Workflow agent and automation build', reason: 'Evaluate structured actions, software integration, coding, and agent orchestration.' },
    { family: 'Anthropic Claude', role: 'Policy, document, and exception review', reason: 'Evaluate long operational documents, decision explanations, and escalation quality.' },
    { family: 'Mistral / efficient model', role: 'High-volume routine tasks', reason: 'Benchmark lower-cost classification, extraction, and multilingual processing.' }
  ],
  regulated: [
    { family: 'Anthropic Claude', role: 'Document analysis and issue spotting', reason: 'Evaluate long-context analysis with citations, limitations, and human escalation.' },
    { family: 'OpenAI', role: 'Structured evidence and governed workflow', reason: 'Evaluate schema-constrained outputs, tool use, audit logs, and review checkpoints.' },
    { family: 'Private open model', role: 'Sensitive-data boundary', reason: 'Evaluate local or controlled deployment where data policy requires it.' }
  ],
  media: [
    { family: 'Google Gemini / media models', role: 'Multimodal campaign studio', reason: 'Evaluate image, video, audio, and long media-context workflows.' },
    { family: 'OpenAI', role: 'Campaign strategy and production orchestration', reason: 'Evaluate creative briefing, structured asset plans, reasoning, and automation.' },
    { family: 'Specialized image / video models', role: 'Final asset generation', reason: 'Compare licensed production quality, consistency, editing control, and cost.' }
  ],
  voice: [
    { family: 'Google Gemini live / speech family', role: 'Real-time multimodal conversation', reason: 'Evaluate latency, speech understanding, multilingual behavior, and live interaction.' },
    { family: 'OpenAI audio / realtime family', role: 'Voice agent and tool workflow', reason: 'Evaluate conversational quality, tool execution, safety, and handoffs.' },
    { family: 'Specialized speech models', role: 'Transcription and accessibility', reason: 'Benchmark diarization, accents, captions, privacy, and cost.' }
  ],
  developer: [
    { family: 'OpenAI + Codex', role: 'Primary implementation and code review', reason: 'Evaluate repository reasoning, agentic coding, tests, and deployment workflows.' },
    { family: 'Anthropic Claude', role: 'Architecture and independent critique', reason: 'Evaluate large-codebase analysis, specifications, refactoring, and risk review.' },
    { family: 'Google Gemini', role: 'Multimodal QA and alternate implementation', reason: 'Evaluate long context, interface inspection, media inputs, and implementation comparison.' }
  ],
  private: [
    { family: 'Meta Llama', role: 'Controlled open-weight deployment', reason: 'Evaluate customization, infrastructure requirements, governance, and private serving.' },
    { family: 'Mistral', role: 'Efficient multilingual private workloads', reason: 'Evaluate deployability, speed, language coverage, and operating cost.' },
    { family: 'Hosted frontier model benchmark', role: 'Quality reference', reason: 'Use an approved hosted model as a benchmark before accepting a private-model tradeoff.' }
  ]
};

const priorityNotes: Record<Locale, Record<Priority, string>> = {
  en: {
    quality: 'Run blind task evaluations first; accept higher cost only when the measured quality gain matters to the customer.',
    cost: 'Test smaller and efficient models first, then escalate only the difficult requests to a higher-capability model.',
    speed: 'Measure end-to-end latency, use routing and caching, and reserve deeper reasoning for requests that need it.',
    privacy: 'Minimize data, separate sensitive workflows, prefer controlled deployment where required, and document human access.'
  },
  fr: {
    quality: 'Commencez par des évaluations à l’aveugle; acceptez un coût supérieur uniquement si le gain mesuré compte pour le client.',
    cost: 'Testez d’abord les modèles plus petits et efficaces, puis réservez les modèles avancés aux demandes difficiles.',
    speed: 'Mesurez la latence complète, utilisez routage et cache, et réservez le raisonnement profond aux demandes nécessaires.',
    privacy: 'Minimisez les données, séparez les flux sensibles, préférez un déploiement contrôlé et documentez l’accès humain.'
  },
  ar: {
    quality: 'ابدأ بتقييمات عمياء للمهام ولا تقبل تكلفة أعلى إلا عندما يكون تحسن الجودة المقاس مهمًا للعميل.',
    cost: 'اختبر النماذج الأصغر والأكفأ أولًا، ثم صعّد الطلبات الصعبة فقط إلى نموذج أعلى قدرة.',
    speed: 'قس زمن الاستجابة الكامل واستخدم التوجيه والتخزين المؤقت وخصص الاستدلال الأعمق للطلبات التي تحتاجه.',
    privacy: 'قلل البيانات وافصل مسارات العمل الحساسة وفضل النشر المتحكم به عند الحاجة ووثق الوصول البشري.'
  }
};

export function AiModelRecommender({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [appType, setAppType] = useState<AppType>('developer');
  const [priority, setPriority] = useState<Priority>('quality');
  const stack = useMemo(() => recommendations[appType], [appType]);

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-2xl" aria-labelledby="model-recommender-title">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 p-7 text-white md:p-10">
        <p className="text-xs font-black uppercase tracking-[.2em] text-gold-400">{t.eyebrow}</p>
        <h2 id="model-recommender-title" className="mt-3 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">{t.title}</h2>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-white/75">{t.intro}</p>
      </div>
      <div className="p-7 md:p-10">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="font-black text-navy-900">{t.app}<select value={appType} onChange={event => setAppType(event.target.value as AppType)} className="mt-3 min-h-12 w-full rounded-xl border border-navy-100 bg-navy-50 p-3 font-semibold outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200">{(Object.keys(t.appOptions) as AppType[]).map(key => <option key={key} value={key}>{t.appOptions[key]}</option>)}</select></label>
          <label className="font-black text-navy-900">{t.priority}<select value={priority} onChange={event => setPriority(event.target.value as Priority)} className="mt-3 min-h-12 w-full rounded-xl border border-navy-100 bg-navy-50 p-3 font-semibold outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200">{(Object.keys(t.priorities) as Priority[]).map(key => <option key={key} value={key}>{t.priorities[key]}</option>)}</select></label>
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-emerald-700">{t.result}</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">{stack.map((item, index) => <article key={`${appType}-${item.family}`} className="rounded-2xl border border-navy-100 bg-navy-50 p-5"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-black text-navy-900">{item.family}</h3><span className="grid h-8 w-8 place-items-center rounded-full bg-gold-500 text-xs font-black text-navy-900">{index + 1}</span></div><p className="mt-3 text-sm font-black text-emerald-800">{item.role}</p><p className="mt-2 text-sm leading-6 text-navy-600">{item.reason}</p></article>)}</div>
        <div className="mt-6 rounded-2xl border border-gold-400/50 bg-gold-200/30 p-5"><p className="font-black text-navy-900">{t.priorities[priority]}</p><p className="mt-2 text-sm leading-6 text-navy-600">{priorityNotes[locale][priority]}</p></div>
        <p className="mt-5 text-xs leading-5 text-navy-500">{t.resultNote}</p>
        <details className="mt-6 rounded-2xl border border-navy-100 p-5"><summary className="cursor-pointer font-black text-navy-900">{t.catalog}</summary><p className="mt-3 text-sm leading-6 text-navy-600">{t.catalogText}</p></details>
      </div>
    </section>
  );
}
