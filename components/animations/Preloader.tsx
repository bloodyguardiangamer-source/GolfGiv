'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.6,
          ease: 'power4.in',
          display: 'none',
        });
      },
    });

    tl.to(barRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
    });

    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
    }, "-=0.1");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div ref={textRef} className="mb-6">
        <h1 className="font-serif text-5xl font-bold">
          Golf<span className="text-primary">Give</span>
        </h1>
      </div>
      <div className="w-48 h-[2px] bg-border relative overflow-hidden">
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full w-0 bg-primary"
        />
      </div>
    </div>
  );
}
