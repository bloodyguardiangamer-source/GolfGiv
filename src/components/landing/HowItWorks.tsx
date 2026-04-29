'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

const steps = [
  {
    number: '01',
    label: 'SUBSCRIBE',
    title: 'Choose your plan. Join the community.',
    description: 'Pick monthly or yearly. A portion of every subscription goes straight to your chosen charity — minimum 10%, you decide how much. Secure payment via Stripe.',
    card: (
      <div 
        className="group relative bg-surface border border-border rounded-2xl p-8 w-full max-w-[400px] overflow-hidden transition-colors duration-500 hover:border-primary/30"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }}
      >
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--x) var(--y), rgba(184, 245, 90, 0.08), transparent 40%)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex gap-4 mb-8">
          <div className="flex-1 p-4 rounded-xl border border-primary bg-primary/5 text-center">
            <div className="text-[10px] text-primary font-bold mb-1">MONTHLY</div>
            <div className="text-xl font-bold">£9.99</div>
          </div>
          <div className="flex-1 p-4 rounded-xl border border-border bg-background/50 text-center">
            <div className="text-[10px] text-muted font-bold mb-1">YEARLY</div>
            <div className="text-xl font-bold">£89.99</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted">
            <span>Charity Donation</span>
            <span className="text-primary">15%</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full w-[60%] bg-primary" />
          </div>
        </div>
        </div>
      </div>
    )
  },
  {
    number: '02',
    label: 'PLAY & SCORE',
    title: 'Enter your 5 latest Stableford scores.',
    description: 'After every round, log your score. We keep your last 5. Those 5 numbers become your draw entries every month. The better you play — the more you might win.',
    card: (
      <div 
        className="group relative bg-surface border border-border rounded-2xl p-8 w-full max-w-[400px] overflow-hidden transition-colors duration-500 hover:border-primary/30"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }}
      >
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--x) var(--y), rgba(184, 245, 90, 0.08), transparent 40%)`,
          }}
        />
        <div className="relative z-10">
          <div className="grid grid-cols-5 gap-2 mb-8">
          {[38, 34, 31, 36, 29].map((s, i) => (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg border border-border bg-background text-sm font-bold">
              {s}
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-lg border border-dashed border-border text-muted text-xs hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all">
          + Add New Score
        </button>
        </div>
      </div>
    )
  },
  {
    number: '03',
    label: 'WIN & GIVE',
    title: 'Monthly draws. Real prizes. Real impact.',
    description: 'Every month we draw 5 numbers. Match 3, 4, or all 5 and win a share of the prize pool. The jackpot rolls over if unclaimed. And your charity gets paid regardless.',
    card: (
      <div 
        className="group relative bg-surface border border-border rounded-2xl p-8 w-full max-w-[400px] overflow-hidden transition-colors duration-500 hover:border-primary/30"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }}
      >
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--x) var(--y), rgba(184, 245, 90, 0.08), transparent 40%)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-muted">MAY DRAW RESULTS</span>
          <span className="text-[10px] font-bold text-accent">JACKPOT MATCH</span>
        </div>
        <div className="flex gap-2 mb-8">
          {[27, 14, 38, 9, 42].map((n, i) => (
            <div key={i} className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border",
              i === 2 ? "bg-primary border-primary text-background" : "border-border bg-background"
            )}>
              {n}
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <div className="text-[10px] text-primary font-bold mb-1">YOUR WINNINGS</div>
          <div className="text-2xl font-bold">£420.00</div>
        </div>
        </div>
      </div>
    )
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  // ... existing useEffect ...

  return (
    <section id="how-it-works" ref={containerRef} className="w-full py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold">HOW IT WORKS</span>
          <h2 className="font-serif text-[44px] lg:text-[64px] font-bold mt-4">Three steps. Real impact.</h2>
        </div>

        <div className="space-y-32 lg:space-y-64">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 relative">
              <div className="absolute -left-12 lg:-left-24 top-0 text-[180px] lg:text-[280px] font-bold text-border/20 select-none pointer-events-none leading-none">
                {step.number}
              </div>
              
              <div className="flex-1 z-10">
                <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-4 block">
                  {step.label}
                </span>
                <h3 className="font-serif text-3xl lg:text-[36px] font-bold mb-6 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted text-base lg:text-[16px] leading-[1.75] max-w-[520px]">
                  {step.description}
                </p>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end z-10 w-full">
                {step.card}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
