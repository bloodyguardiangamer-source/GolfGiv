'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Connect Lenis to GSAP ticker
    const update = (time: number) => {
      ScrollTrigger.update();
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      <LenisExposer />
      {children}
    </ReactLenis>
  );
}

/** Exposes the Lenis instance on window so Navbar can use it for smooth hash scrolling */
function LenisExposer() {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      (window as any).__lenis = lenis;
    }
    return () => {
      (window as any).__lenis = null;
    };
  }, [lenis]);

  return null;
}
