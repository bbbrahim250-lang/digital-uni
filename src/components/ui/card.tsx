import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-card border border-navy-100 bg-white p-5 shadow-card', className)}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'demo' }) {
  const toneClasses = {
    neutral: 'bg-navy-50 text-navy-600',
    gold: 'bg-gold-200 text-navy-900',
    demo: 'bg-highlight-turquoise/10 text-highlight-turquoise'
  } as const;

  return (
    <span className={clsx('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', toneClasses[tone])}>
      {children}
    </span>
  );
}
