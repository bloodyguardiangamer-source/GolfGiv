'use client';

import { useEffect, useRef } from 'react';
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;

    try {
      barba.init({
        transitions: [{
          name: 'opacity-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5
            });
          },
          enter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            ScrollTrigger.refresh();
            
            return gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.5
            });
          }
        }]
      });
      isInitialized.current = true;
    } catch (e) {
      console.error("Barba initialization failed:", e);
    }
  }, []);

  return (
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="home">
        {children}
      </div>
    </div>
  );
}
