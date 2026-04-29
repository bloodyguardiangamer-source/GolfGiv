'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cn } from '@/lib/utils/cn';

gsap.registerPlugin(ScrollTrigger);

export function DrawMechanics() {
  const ballsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.draw-ball',
      { y: -60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'bounce.out',
        scrollTrigger: {
          trigger: ballsRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section id="draw" className="w-full py-32 px-6 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold">THE DRAW</span>
          <h2 className="font-serif text-[44px] lg:text-[64px] font-bold mt-4">How the draw works.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={ballsRef} className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {[27, 14, 38, 9, 42].map((num, i) => (
              <div 
                key={i} 
                className={cn(
                  "draw-ball w-16 h-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-xl lg:text-3xl font-bold border-2 transition-all duration-500",
                  i === 2 ? "border-primary text-primary scale-110 bg-primary/5" : "border-border text-white bg-background"
                )}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <p className="text-muted text-lg leading-relaxed">
              Each month, 5 numbers are drawn from the pool of all player scores on the platform.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              Your last 5 Stableford scores are your entries. Match 3 to win. Match 4 to win more. Match all 5 and claim the jackpot.
            </p>
            <div className="p-6 rounded-xl bg-background border border-border">
              <p className="text-sm text-muted italic">
                Two draw modes: pure random lottery, or algorithmically weighted by score frequency. Admin controls which mode runs each month.
              </p>
            </div>
            <p className="text-xs text-muted">
              Results published monthly. Winners notified by email. Proof of score required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
