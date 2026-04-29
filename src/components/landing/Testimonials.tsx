'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: 'Michael T.',
      role: 'Handicap 12',
      quote: 'I used to just play for myself. Now my weekend rounds are funding youth sports programs. Winning £2,400 last month was just the icing on the cake.',
      charity: 'Golf Foundation',
    },
    {
      name: 'Sarah W.',
      role: 'Handicap 8',
      quote: 'The feeling of knowing your bad rounds still do good in the world takes the pressure off. And when you hit that 5-match jackpot? Unreal.',
      charity: 'Mind',
    },
    {
      name: 'James L.',
      role: 'Handicap 18',
      quote: 'The platform is slick, entering scores is seamless, and seeing the live impact map makes it all real. Golf needed this modernization badly.',
      charity: 'WWF',
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    tl.fromTo('.testi-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    tl.fromTo('.testi-card',
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: 'power3.out'
      },
      "-=0.5"
    );

  }, []);

  return (
    <section ref={sectionRef} className="w-full py-32 px-6 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="testi-header mb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[11px] uppercase tracking-[0.16em] text-primary mb-6">
            REAL STORIES
          </span>
          <h2 className="font-serif text-[44px] lg:text-[64px] font-bold">
            Don't just take our word for it.
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="testi-card group relative bg-surface/50 backdrop-blur-md border border-border rounded-3xl p-10 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:-translate-y-2"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
              }}
            >
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 mix-blend-overlay"
                style={{
                  background: `radial-gradient(400px circle at var(--x) var(--y), rgba(184, 245, 90, 0.15), transparent 40%)`,
                }}
              />
              
              <Quote className="w-10 h-10 text-primary/20 mb-8" />
              
              <p className="text-white text-lg leading-[1.6] mb-10 relative z-10 font-medium">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10 mt-auto">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-xs text-muted">{t.role} · Supporting {t.charity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
