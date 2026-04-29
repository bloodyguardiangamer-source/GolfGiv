'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 182400, prefix: '$', suffix: '', label: 'Donated', color: 'text-primary' },
    { value: 3240, prefix: '', suffix: '', label: 'Golfers Joined', color: 'text-white' },
    { value: 47, prefix: '', suffix: '', label: 'Charities Funded', color: 'text-accent' },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.stat-number');
      
      elements.forEach((el: any, i) => {
        const target = { val: 0 };
        gsap.to(target, {
          val: stats[i].value,
          duration: 2.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          onUpdate: () => {
            if (el) {
              const formatted = Math.floor(target.val).toLocaleString();
              el.innerText = `${stats[i].prefix}${formatted}${stats[i].suffix}`;
            }
          }
        });
      });

      gsap.fromTo('.stat-item', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section className="w-full bg-surface border-y border-border py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item flex flex-1 w-full lg:w-auto items-center justify-center relative">
              <div className="text-center group">
                <div 
                  className={`stat-number text-[64px] font-bold tracking-tighter leading-none transition-transform duration-500 group-hover:scale-105 ${stat.color}`}
                >
                  {stat.prefix}0{stat.suffix}
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted mt-2 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 h-16 w-[1px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
