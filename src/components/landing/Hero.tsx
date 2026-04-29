'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import gsap from 'gsap';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const tl = gsap.timeline({ delay: 2.2 });

    tl.fromTo(labelRef.current, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Animation logic
    const lines = headlineRef.current?.innerText.split('\n').filter(l => l.trim() !== '') || [];
    if (headlineRef.current) {
      headlineRef.current.innerHTML = lines.map(line => 
        `<div class="overflow-hidden"><div class="headline-line inline-block">${line}</div></div>`
      ).join('');
      
      tl.fromTo('.headline-line', 
        { y: 100 },
        { y: 0, duration: 1, stagger: 0.15, ease: 'power4.out' },
        "-=0.4"
      );
    }

    tl.fromTo(subheadlineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      "-=0.6"
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      "-=0.6"
    );
  }, [mounted]);

  return (
    <section className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 overflow-hidden bg-background">
      {/* Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Radial Glow */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Left Column */}
      <div className="w-full lg:w-[60%] z-10 pt-20 lg:pt-0">
        <span ref={labelRef} className="inline-block text-[11px] uppercase tracking-[0.16em] text-muted mb-6 opacity-0">
          PLAY · GIVE · WIN
        </span>
        <h1 ref={headlineRef} className="font-serif text-[52px] lg:text-[88px] leading-[1.05] font-bold text-white mb-8">
          Golf that{"\n"}
          changes{"\n"}
          lives.
        </h1>
        <p ref={subheadlineRef} className="text-muted text-lg lg:text-[18px] leading-[1.75] max-w-[480px] mb-10">
          Subscribe. Enter your scores. Win monthly prizes.
          Give to a charity you believe in. Every single month.
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button className="px-9 py-4 bg-primary text-background font-bold rounded-lg text-sm hover:scale-105 transition-transform">
            Start Playing
          </button>
          <button className="text-muted text-sm hover:text-white underline decoration-muted/30 underline-offset-4 transition-colors">
            See how it works ↓
          </button>
        </div>
        <p className="text-[11px] text-muted mt-6">
          No commitment. Cancel anytime.
        </p>
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex w-[40%] justify-end z-10">
        <div className="relative w-full max-w-[400px] bg-surface border border-border rounded-2xl p-7 shadow-2xl animate-float">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-primary">LIVE DRAW IN 14 DAYS</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { date: '12 May', score: 38, active: true },
              { date: '05 May', score: 34 },
              { date: '28 Apr', score: 31 },
              { date: '21 Apr', score: 36 },
              { date: '14 Apr', score: 29 },
            ].map((entry, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-colors",
                  entry.active ? "bg-primary/5 border-primary/20" : "bg-background/50 border-border/50"
                )}
              >
                <span className="text-xs text-muted">{entry.date}</span>
                <span className={cn("font-bold", entry.active ? "text-primary" : "text-white")}>
                  {entry.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-[1px] h-12 bg-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
