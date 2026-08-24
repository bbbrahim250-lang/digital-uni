'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';

type Program = {
  title: string;
  short: string;
  description: string;
  skills: string;
  audience: string;
  certification: string;
  x: number;
  y: number;
  executive?: boolean;
};

const programs: Program[] = [
  { title: 'AI and Machine Learning', short: 'AI + ML', description: 'Build practical foundations for intelligent systems and responsible model development.', skills: 'Python, supervised learning, evaluation, responsible AI', audience: 'Aspiring AI practitioners and technical professionals', certification: 'Supports preparation toward relevant industry certification pathways.', x: 8, y: 30 },
  { title: 'Computer Vision and CNN', short: 'Vision + CNN', description: 'Explore image understanding with convolutional neural networks and applied projects.', skills: 'Image pipelines, CNN architecture, model evaluation', audience: 'Developers, analysts, and visual-computing learners', certification: 'Professional certification direction depends on the selected provider.', x: 25, y: 16 },
  { title: 'TensorFlow / Keras / ANN', short: 'TensorFlow', description: 'Design and train artificial neural networks with modern deep-learning tools.', skills: 'TensorFlow, Keras, ANN design, experimentation', audience: 'Python learners ready for deep learning', certification: 'Skills align with common machine-learning certification objectives.', x: 43, y: 31 },
  { title: 'EDA, Visualization, and K-Means', short: 'EDA + K-Means', description: 'Reveal patterns through exploratory analysis, visual storytelling, and clustering.', skills: 'EDA, visualization, clustering, interpretation', audience: 'Analysts and emerging data scientists', certification: 'Provides preparation, not a third-party credential.', x: 62, y: 15 },
  { title: 'Linear Regression and Model Assumptions', short: 'Regression', description: 'Analyze relationships, assumptions, model fit, and meaningful interpretation.', skills: 'Regression, diagnostics, inference, model analysis', audience: 'Business analysts and data learners', certification: 'May support broader data-analysis certification preparation.', x: 81, y: 30 },
  { title: 'Pandas, NumPy, and Visualization', short: 'Pandas + NumPy', description: 'Develop a reliable workflow for preparing, analyzing, and communicating data.', skills: 'Pandas, NumPy, data cleaning, visualization', audience: 'Beginners and working professionals', certification: 'Foundation for provider-specific data credentials.', x: 16, y: 68 },
  { title: 'Cybersecurity', short: 'Cybersecurity', description: 'Practice secure systems thinking, threat analysis, and incident-response foundations.', skills: 'Security fundamentals, risk, defense, incident response', audience: 'IT professionals and security career changers', certification: 'Offers direction for external certification preparation only.', x: 35, y: 82 },
  { title: 'Blockchain and Green Cryptocurrency', short: 'Blockchain', description: 'Study distributed systems, digital assets, smart contracts, and responsible risk analysis.', skills: 'Blockchain architecture, cryptography, smart contracts, risk', audience: 'Technology and finance professionals', certification: 'No environmental benefit or third-party credential is implied.', x: 54, y: 66 },
  { title: 'Cloud Computing and Data Science', short: 'Cloud + Data', description: 'Connect scalable cloud platforms with practical data-science workflows.', skills: 'Cloud foundations, data pipelines, analytics, deployment', audience: 'Developers, analysts, and IT leaders', certification: 'Can guide preparation for independently issued cloud credentials.', x: 74, y: 81 },
  { title: 'EXECUTIVE CTO • COO • CIO PROGRAMS', short: 'Executive', description: 'A prestigious leadership pathway for technology, operations, and information executives.', skills: 'Technology strategy, operations, governance, executive leadership', audience: 'Senior leaders and experienced professionals', certification: 'Digital-UNI executive program; no academic credit is claimed.', x: 91, y: 64, executive: true }
];

const stations = ['Paris', 'New York', 'Algiers', 'Kuala Lumpur', 'Santa Monica'];

export function CinematicPathway({ locale, eyebrow, headline, enrollLabel, pathwaysLabel }: { locale: Locale; eyebrow: string; headline: string; enrollLabel: string; pathwaysLabel: string }) {
  const [selected, setSelected] = useState<Program | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause();
  }, []);

  return (
    <section className="pathway-experience" aria-labelledby="cinematic-hero-title">
      <div className="pathway-video-frame">
        <video ref={videoRef} className="pathway-video block h-auto w-full" autoPlay muted loop playsInline controls preload="metadata" poster="/images/ai-train-poster.png">
          <source src="/images/digital-uni-ai-train-trailer.mp4.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="pathway-stage">
        <div className="pathway-heading">
          <p>{eyebrow}</p>
          <h1 id="cinematic-hero-title">DIGITAL-UNI <span>AI TRAIN</span></h1>
          <h2>{headline}</h2>
        </div>

        <div className="route-stations" aria-label="International AI Train stations">
          {stations.map((station, index) => <span key={station}><i />{station}{index === 4 && <small>Proposed site</small>}</span>)}
        </div>

        <div className="glass-map" aria-label="Interactive global learning itinerary">
          <div className="map-title"><span>GLOBAL LEARNING ITINERARY</span><small>Select a destination</small></div>
          <svg className="route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 30 L25 16 L43 31 L62 15 L81 30 L91 64 L74 81 L54 66 L35 82 L16 68 Z" />
            <circle r="1.2"><animateMotion dur="10s" repeatCount="indefinite" path="M8 30 L25 16 L43 31 L62 15 L81 30 L91 64 L74 81 L54 66 L35 82 L16 68 Z" /></circle>
          </svg>
          {programs.map((program, index) => (
            <button key={program.title} type="button" className={`map-node ${program.executive ? 'executive-node' : ''}`} style={{ left: `${program.x}%`, top: `${program.y}%` }} onClick={() => setSelected(program)} aria-label={`Open details for ${program.title}`}>
              <b>{String(index + 1).padStart(2, '0')}</b><span>{program.short}</span>
            </button>
          ))}
        </div>

        <div className="brand-coin" aria-label="Digital-UNI educational brand symbol"><b>DU</b><span>LEARN • CONNECT • GROW</span></div>
      </div>

      <div className="pathway-actions" aria-label="Start your Digital-UNI journey">
        <Link href={`/${locale}/enrollment`} className="pathway-primary">{enrollLabel}</Link>
        <Link href={`/${locale}/pathways`} className="pathway-secondary">{pathwaysLabel}</Link>
      </div>

      <div className="mobile-program-strip" aria-label="Learning programs">
        {programs.map(program => <button key={program.title} onClick={() => setSelected(program)}>{program.short}<span>Explore program →</span></button>)}
      </div>

      <Link href={`/${locale}/industrial-revolution-4`} className="pathway-ad">
        <img src="/images/industrial-revolution-4-showcase.webp" alt="Digital-UNI Industrial Revolution 4.0 professional learning pathways" />
        <span><b>BUILD YOUR INDUSTRIAL REVOLUTION 4.0 PATHWAY</b><small>View programs and applied learning projects →</small></span>
      </Link>

      {selected && (
        <div className="program-modal" role="dialog" aria-modal="true" aria-labelledby="program-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <article className={selected.executive ? 'executive-panel' : ''}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close program details">×</button>
            <p className="modal-kicker">DIGITAL-UNI LEARNING DESTINATION</p>
            <h2 id="program-title">{selected.title}</h2>
            {selected.executive && <p className="executive-price">Starting at $25,000</p>}
            <p>{selected.description}</p>
            <dl><div><dt>Skills &amp; outcomes</dt><dd>{selected.skills}</dd></div><div><dt>Intended audience</dt><dd>{selected.audience}</dd></div><div><dt>Certification direction</dt><dd>{selected.certification}</dd></div></dl>
            <p className="credit-note">Academic or college credit applies only when formally approved and verified. No credit is currently claimed here.</p>
            <div className="modal-actions"><Link href={`/${locale}/pathways`}>Explore the pathway</Link><Link href={`/${locale}/enrollment`}>{selected.executive ? 'Apply or inquire' : 'Request enrollment'}</Link></div>
          </article>
        </div>
      )}
    </section>
  );
}
