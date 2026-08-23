import type { ReactNode } from 'react';

export function StaticPage({
  title,
  intro,
  children
}: {
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
      <p className="mt-4 text-navy-600">{intro}</p>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}
