"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

type BarbaTransitionData = {
  current: { container: Element };
  next: { container: Element };
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isInitialized.current) return;

    let cancelled = false;

    try {
      void import("@barba/core").then(({ default: barba }) => {
        if (cancelled) return;

        barba.init({
          transitions: [
            {
              name: "opacity-transition",
              leave(data: BarbaTransitionData) {
                return gsap.to(data.current.container, {
                  opacity: 0,
                  duration: 0.5,
                });
              },
              enter(data: BarbaTransitionData) {
                ScrollTrigger.getAll().forEach((t) => t.kill());
                ScrollTrigger.refresh();

                return gsap.from(data.next.container, {
                  opacity: 0,
                  duration: 0.5,
                });
              },
            },
          ],
        });

        isInitialized.current = true;
      });

      return () => {
        cancelled = true;
      };
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
