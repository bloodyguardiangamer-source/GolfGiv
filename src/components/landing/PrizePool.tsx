'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PrizePool() {
  const barRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: barRef.current,
        start: 'top 80%',
      },
    });

    tl.fromTo('.prize-segment', 
      { width: 0 },
      { width: (i, target) => target.dataset.width + '%', duration: 1.2, stagger: 0.1, ease: 'power4.out' }
    );

    gsap.fromTo('.prize-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
        }
      }
    );
  }, []);

  return (
    <section id="prize-pool" className="w-full py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold">THE PRIZE POOL</span>
          <h2 className="font-serif text-[44px] lg:text-[64px] font-bold mt-4">Win big. Give more.</h2>
        </div>

        <div ref={barRef} className="w-full h-20 bg-surface border border-border rounded-xl overflow-hidden flex mb-16">
          <div data-width="40" className="prize-segment h-full bg-accent flex items-center px-6 overflow-hidden whitespace-nowrap">
            <span className="text-[10px] font-bold text-background">5 MATCH — JACKPOT</span>
          </div>
          <div data-width="35" className="prize-segment h-full bg-primary flex items-center px-6 overflow-hidden whitespace-nowrap">
            <span className="text-[10px] font-bold text-background">4 MATCH</span>
          </div>
          <div data-width="25" className="prize-segment h-full bg-muted flex items-center px-6 overflow-hidden whitespace-nowrap">
            <span className="text-[10px] font-bold text-background">3 MATCH</span>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '5 MATCH — JACKPOT', share: '40% of pool', amount: '£19,200', desc: 'Rolls over if unclaimed', color: 'text-accent' },
            { title: '4 MATCH', share: '35% of pool', amount: '£16,800', desc: 'Split among all 4-match winners', color: 'text-white' },
            { title: '3 MATCH', share: '25% of pool', amount: '£12,000', desc: 'Split among all 3-match winners', color: 'text-muted' },
          ].map((tier, i) => (
            <div key={i} className="prize-card bg-surface border border-border rounded-2xl p-8">
              <div className="text-[10px] font-bold text-muted mb-2">{tier.title}</div>
              <div className="text-xs text-muted mb-6">{tier.share} · {tier.desc}</div>
              <div className={`text-4xl font-bold ${tier.color}`}>{tier.amount}</div>
              <div className="text-[10px] text-muted mt-2">this month</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted mt-12 italic">
          Prize pool grows with every new subscriber. Join now to increase the pot.
        </p>
      </div>
    </section>
  );
}
