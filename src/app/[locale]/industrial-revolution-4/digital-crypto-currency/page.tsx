import Link from 'next/link';

const projects = [
  {
    title: 'NESU Project',
    description: 'Nur Energy Settlement Unit — a proposed sovereign and institutional settlement concept for energy and strategic-resource trade.',
    href: 'https://nesu-sovereign-settlement.vercel.app'
  },
  {
    title: 'Green Euro–Dinar Corridor Token',
    description: 'Digital-UNI corridor project exploring a green Euro–Dinar settlement framework and related token architecture.',
    href: 'https://green-euro-dinar-corridor-token.vercel.app'
  }
] as const;

export default function DigitalCryptoCurrencyPage() {
  return (
    <main className="bg-navy-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold-400">Industrial Revolution 4.0</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Digital-Crypto-Currency</h1>
          <p className="mt-5 text-lg leading-8 text-navy-100">
            Digital-UNI research and project links covering sovereign settlement, green corridor architecture, and the Swiss regulatory-counsel workstream.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:border-gold-400/70 hover:bg-white/10"
            >
              <h2 className="text-xl font-black text-gold-300">{project.title}</h2>
              <p className="mt-3 leading-7 text-navy-100">{project.description}</p>
              <span className="mt-5 inline-flex text-sm font-bold text-white">Open project ↗</span>
            </a>
          ))}
        </div>

        <section id="swiss-counsel" className="mt-12 rounded-2xl border border-sky-300/30 bg-sky-950/30 p-7">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">Switzerland Counsel</p>
          <h2 className="mt-2 text-2xl font-black">Swiss Fintech / Financial-Markets Counsel Workstream</h2>
          <p className="mt-4 max-w-4xl leading-7 text-navy-100">
            Digital-UNI is preparing a scoping conversation with Swiss fintech and financial-markets counsel concerning the proposed NESU structure. The requested work includes an initial FINMA classification view, identification of the applicable licensing pathway, a proposal and fee estimate for a formal legal opinion, and advice on sequencing Swiss entity formation and regulatory engagement.
          </p>
          <p className="mt-4 max-w-4xl leading-7 text-navy-100">
            The concept described for counsel is a proposed permissioned, gold- and commodity-backed settlement instrument intended only for sovereign governments, central banks, state energy companies, and approved institutional counterparties. It is not proposed for retail issuance or public trading.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-navy-100">
            <strong className="text-white">Important:</strong> this is a conceptual and organizational workstream, not a legal opinion or regulatory approval. Any FINMA, Swiss, Algerian, EU, or other regulatory classification must be independently determined by qualified counsel and the relevant authorities.
          </div>
        </section>

        <div className="mt-10">
          <Link href="../" className="text-sm font-bold text-gold-300 hover:text-gold-200">← Back to Industrial Revolution 4.0</Link>
        </div>
      </section>
    </main>
  );
}
