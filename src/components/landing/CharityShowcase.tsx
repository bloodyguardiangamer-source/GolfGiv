'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const charities = [
  {
    name: 'Golf Foundation',
    category: 'Youth Sport',
    description: 'Bringing golf to young people from all backgrounds.',
    featured: true,
    initial: 'G',
  },
  {
    name: 'Mind',
    category: 'Mental Health',
    description: 'Providing advice and support to empower anyone experiencing a mental health problem.',
    initial: 'M',
  },
  {
    name: 'The Princes Trust',
    category: 'Youth Development',
    description: 'Helping young people to get into jobs, education and training.',
    initial: 'P',
  },
  {
    name: 'WWF',
    category: 'Environment',
    description: 'Protecting the natural world and the future of our planet.',
    initial: 'W',
  },
  {
    name: 'Macmillan',
    category: 'Health',
    description: 'Supporting people living with cancer to live life as fully as they can.',
    initial: 'M',
  },
];

export function CharityShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current || !triggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const pin = gsap.fromTo(
      sectionRef.current,
      { x: 0 },
      {
        x: () => -(sectionRef.current?.scrollWidth || 0) + window.innerWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${sectionRef.current?.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      pin.kill();
      if (pin.scrollTrigger) pin.scrollTrigger.kill();
    };
  }, [mounted]);

  return (
    <section id="charities" ref={triggerRef} className="overflow-hidden bg-background">
      <div className="px-6 lg:px-24 pt-32 pb-16">
        <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold">GIVING BACK</span>
        <h2 className="font-serif text-[44px] lg:text-[64px] font-bold mt-4">Your game. Their future.</h2>
        <p className="text-muted mt-4 max-w-xl">
          Choose from our partner charities. Your contribution goes directly to them every month.
        </p>
      </div>

      <div ref={sectionRef} className="flex gap-8 px-6 lg:px-24 pb-32 w-fit">
        {charities.map((charity, i) => (
          <div
            key={i}
            className="w-[300px] lg:w-[380px] flex-shrink-0 bg-surface border border-border rounded-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-bold text-xl">
                {charity.initial}
              </div>
              {charity.featured && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider">
                  FEATURED
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{charity.name}</h3>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4 block">
              {charity.category}
            </span>
            <p className="text-muted text-sm leading-relaxed mb-8 flex-grow">
              {charity.description}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-muted">
                <span>CONTRIBUTION</span>
                <span className="text-primary">10% - 25%</span>
              </div>
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-primary" />
              </div>
            </div>
          </div>
        ))}
        
        <div className="w-[300px] lg:w-[380px] flex-shrink-0 bg-primary/5 border border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-serif font-bold mb-4">+ 7 more</div>
          <p className="text-muted text-sm mb-8">charities. You choose.</p>
          <button className="text-primary font-bold text-sm hover:underline">
            Browse All Charities →
          </button>
        </div>
      </div>
    </section>
  );
}
