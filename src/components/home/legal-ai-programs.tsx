import Link from 'next/link';
import type { Locale } from '@/i18n/config';

const legalPrograms = [
  {
    title: 'Digital-UNI™ Lawyer AI App',
    description: 'Legal research, case preparation, document analysis, and precedent review.'
  },
  {
    title: 'Digital-UNI™ Judge AI App',
    description: 'Judicial research and precedent analysis, with human judicial decision-making preserved.'
  },
  {
    title: 'Digital-UNI™ Court AI Clerk Assistant',
    description: 'AI-supported court administration, records organization, and document processing.'
  },
  {
    title: 'Digital-UNI™ Court AI Expert',
    description: 'AI systems, digital evidence, model evaluation, expert reporting, and responsible courtroom applications.'
  },
  {
    title: 'Digital-UNI™ Executive AI Leadership',
    description: 'CEO, CTO, CIO, and COO programs, including AI corporate financial audit and mergers-and-acquisitions analysis.'
  }
];

const proofOfServiceModules = [
  'Proof-of-service document intake', 'Service-method and deadline tracking',
  'Jurisdiction and venue rule comparison', 'Conflict and missing-information alerts',
  'Citation-linked procedural research', 'Human legal review and audit trail',
  'Privacy, security, and responsible AI'
];

export function LegalAiPrograms({ locale }: { locale: Locale }) {
  return (
    <section className="legal-ai-programs" aria-labelledby="legal-ai-title">
      <div className="legal-ai-shell">
        <p className="legal-ai-kicker">Professional &amp; executive learning pathways</p>
        <h2 id="legal-ai-title">DIGITAL-UNI™ LEGAL AI &amp; JURISDICTION TECHNOLOGY</h2>
        <p className="legal-ai-intro">Explore responsible, human-centered applications of AI for legal, judicial, court administration, expert, and executive work.</p>

        <div className="legal-ai-pricing" aria-label="Program duration and pricing">
          <p><strong>Executive and Legal AI Programs:</strong> 6 weeks, starting at $25,000.</p>
          <p><strong>Professional Development Pathways:</strong> 12 weeks, starting at $3,000.</p>
        </div>

        <div className="legal-program-grid">
          <article className="legal-program-card legal-program-featured">
            <span className="legal-program-number" aria-hidden="true">NEW</span>
            <h3>Digital-UNI™ AI Agent for Proof-of-Service &amp; Jurisdiction Compatibility</h3>
            <p>A professional legal-technology pathway for organizing proof-of-service records, checking procedural requirements, comparing jurisdictional rules, identifying missing information, and preparing attorney- or court-reviewable reports.</p>
            <ul className="list-disc space-y-1 ps-5 text-sm text-navy-600">{proofOfServiceModules.map(module => <li key={module}>{module}</li>)}</ul>
            <p><strong>6-week executive and legal AI pathway</strong><br />Starting at $25,000</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/enrollment`} className="legal-program-cta">Request Information</Link>
              <Link href={`/${locale}/enrollment`} className="legal-program-cta">Enroll Now</Link>
              <Link href={`/${locale}/payment?program=proof-of-service`} className="legal-program-cta">Pay Tuition</Link>
            </div>
            <p className="text-xs leading-5">Digital-UNI™ is a claimed trademark. This program provides education and decision-support workflow design; it does not constitute legal advice, guarantee valid service, establish jurisdiction, replace judicial review, or represent court approval or certification.</p>
          </article>
          {legalPrograms.map((program, index) => (
            <article className="legal-program-card" key={program.title}>
              <span className="legal-program-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <details>
                <summary>Explore this pathway</summary>
                <p>Request information to discuss intended audience, learning outcomes, scheduling, and the pathway that fits your professional goals.</p>
              </details>
              <Link href={`/${locale}/enrollment`} className="legal-program-cta" aria-label={`Apply for ${program.title}`}>Apply</Link>
              <Link href={`/${locale}/payment?program=${encodeURIComponent(program.title)}`} className="legal-program-cta ms-2" aria-label={`Pay tuition for ${program.title}`}>Pay Tuition</Link>
            </article>
          ))}
        </div>

        <p className="legal-ai-disclaimer">Digital-UNI™ programs are educational offerings. No official court certification, court endorsement, professional licensure, accreditation, or registered trademark status is claimed.</p>
      </div>
    </section>
  );
}
