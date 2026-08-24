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

export function LegalAiPrograms({ locale }: { locale: Locale }) {
  return (
    <section className="legal-ai-programs" aria-labelledby="legal-ai-title">
      <div className="legal-ai-shell">
        <p className="legal-ai-kicker">Professional &amp; executive learning pathways</p>
        <h2 id="legal-ai-title">DIGITAL-UNI™ LEGAL AI &amp; JUDICIAL TECHNOLOGY PROGRAMS</h2>
        <p className="legal-ai-intro">Explore responsible, human-centered applications of AI for legal, judicial, court administration, expert, and executive work.</p>

        <div className="legal-ai-pricing" aria-label="Program duration and pricing">
          <p><strong>Executive and Legal AI Programs:</strong> 6 weeks, starting at $25,000.</p>
          <p><strong>Professional Development Pathways:</strong> 12 weeks, starting at $3,000.</p>
        </div>

        <div className="legal-program-grid">
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
            </article>
          ))}
        </div>

        <p className="legal-ai-disclaimer">Digital-UNI™ programs are educational offerings. No official court certification, court endorsement, professional licensure, accreditation, or registered trademark status is claimed.</p>
      </div>
    </section>
  );
}
