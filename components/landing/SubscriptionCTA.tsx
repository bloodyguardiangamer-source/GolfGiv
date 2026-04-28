'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Lock, Shield, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SubscriptionCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.cta-line',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-40 px-6 bg-background overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <span className="cta-line text-[11px] uppercase tracking-[0.16em] text-muted font-bold mb-6 block">JOIN TODAY</span>
        <h2 className="cta-line font-serif text-[44px] lg:text-[80px] font-bold leading-tight mb-20">
          Play golf.<br />
          Change lives.<br />
          <span className="text-primary italic">Win prizes.</span>
        </h2>

        <div className="cta-line flex flex-col md:flex-row justify-center gap-8 max-w-[800px] mx-auto mb-20">
          {/* Monthly */}
          <div className="flex-1 bg-surface border border-border rounded-2xl p-10 text-left hover:border-muted/50 transition-colors">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">MONTHLY</div>
            <div className="text-3xl font-bold mb-8">£9.99 <span className="text-sm font-normal text-muted">/ month</span></div>
            <ul className="space-y-4 mb-10 text-sm text-muted">
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Enter monthly draws
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Support your charity
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Cancel anytime
              </li>
            </ul>
            <button className="w-full py-4 rounded-lg border border-border font-bold text-sm hover:bg-white hover:text-background transition-all">
              Start Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="flex-1 bg-surface border-2 border-primary rounded-2xl p-10 text-left relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-[10px] font-bold rounded-full">
              BEST VALUE
            </div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">YEARLY</div>
            <div className="text-3xl font-bold mb-2">£89.99 <span className="text-sm font-normal text-muted">/ year</span></div>
            <div className="text-xs text-primary font-bold mb-8">Save £30 per year</div>
            <ul className="space-y-4 mb-10 text-sm text-muted">
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Everything in Monthly
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Priority draw entry
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary" /> Exclusive yearly badge
              </li>
            </ul>
            <button className="w-full py-4 rounded-lg bg-primary text-background font-bold text-sm hover:scale-[1.02] transition-all">
              Start Yearly
            </button>
          </div>
        </div>

        <div className="cta-line flex flex-wrap justify-center gap-8 lg:gap-16">
          <div className="flex items-center gap-3 text-xs text-muted">
            <Lock className="w-4 h-4 text-primary" /> Secure Stripe payment
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Shield className="w-4 h-4 text-primary" /> Cancel anytime
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Heart className="w-4 h-4 text-primary" /> 10% minimum to charity
          </div>
        </div>
      </div>
    </section>
  );
}
