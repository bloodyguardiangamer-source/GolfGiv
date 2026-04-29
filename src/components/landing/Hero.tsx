'use client';

import { useEffect, useRef, useState } from 'react';
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

    // Split text into characters for premium animation
    if (headlineRef.current) {
      const text = headlineRef.current.innerText;
      headlineRef.current.innerHTML = '';
      
      const words = text.split('\n').filter(w => w.trim() !== '');
      
      words.forEach((word, wordIdx) => {
        const wordContainer = document.createElement('div');
        wordContainer.className = 'inline-block overflow-hidden pb-2 mr-4';
        
        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'hero-char inline-block translate-y-[120%] rotate-2';
          charSpan.innerText = char === ' ' ? '\u00A0' : char;
          wordContainer.appendChild(charSpan);
        });
        
        headlineRef.current?.appendChild(wordContainer);
        // Add line break
        if (wordIdx < words.length - 1) {
          headlineRef.current?.appendChild(document.createElement('br'));
        }
      });
    }

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(labelRef.current, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    tl.to('.hero-char', {
      y: '0%',
      rotate: 0,
      duration: 1.05,
      stagger: 0.03,
      ease: 'power4.out',
    }, "-=0.4");

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

    tl.fromTo('.hero-widget',
      { opacity: 0, scale: 0.95, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' },
      "-=1.0"
    );

  }, [mounted]);

  // Floating interaction for the widgets container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    gsap.to('.hero-widget-container', {
      rotateX,
      rotateY,
      duration: 1,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to('.hero-widget-container', {
      rotateX: 0,
      rotateY: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background pt-40 pb-20">
      {/* Center Bordered Container */}
      <div 
        className="relative w-full max-w-[1400px] h-full min-h-[calc(100vh-16rem)] border border-border rounded-[2rem] lg:rounded-[3rem] bg-surface/30 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center px-6 py-12 lg:px-16"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="noiseFilterHero">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilterHero)" />
          </svg>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
            <h1 ref={headlineRef} className="font-serif text-[52px] md:text-[64px] lg:text-[80px] leading-[1.05] font-bold text-white mb-6">
              Golf that{"\n"}
              changes{"\n"}
              lives.
            </h1>
            
            <p ref={subheadlineRef} className="text-muted text-lg lg:text-[18px] leading-[1.6] max-w-[440px] mb-10">
              Submit scores. Win prizes. Fund real charities every month.
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-6">
              <button className="px-8 py-4 bg-primary text-background font-bold rounded-xl text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(184,245,90,0.2)] hover:shadow-[0_0_50px_rgba(184,245,90,0.4)]">
                Start Playing
              </button>
              <button className="text-muted text-sm hover:text-white transition-colors flex items-center gap-2 group">
                See How It Works <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Right Dashboard Visuals */}
          <div className="hidden lg:flex flex-1 relative w-full h-[550px] hero-widget-container" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Monthly Prize Pool Widget */}
            <div className="hero-widget absolute top-4 right-4 w-[280px] bg-surface/80 backdrop-blur-md border border-accent/30 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20 translate-z-[40px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-accent uppercase">Monthly Prize Pool</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">£19,200</div>
              <div className="flex justify-between text-[10px] text-muted mb-2">
                <span>Current Jackpot</span>
                <span>40% of pool</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-accent rounded-full" />
              </div>
            </div>

            {/* Leaderboard Widget */}
            <div className="hero-widget absolute bottom-12 right-20 w-[320px] bg-surface/90 backdrop-blur-md border border-border rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-30 translate-z-[80px]">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[10px] font-bold tracking-wider text-muted uppercase">Live Leaderboard</span>
                <span className="text-[10px] text-primary">MAY 2026</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Alex M.', score: 42, points: '42 pts', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                  { name: 'Sarah J.', score: 38, points: '38 pts', color: 'text-white', bg: 'bg-background/50 border-border/50' },
                  { name: 'David K.', score: 36, points: '36 pts', color: 'text-white', bg: 'bg-background/50 border-border/50' },
                ].map((player, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-xl border ${player.bg}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted font-bold w-4">0{i+1}</span>
                      <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] text-white">
                        {player.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-white">{player.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${player.color}`}>{player.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Donations / Impact Map Widget */}
            <div className="hero-widget absolute top-1/2 -translate-y-1/2 left-0 w-[260px] bg-surface/70 backdrop-blur-md border border-primary/20 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10 translate-z-[20px]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Live Impact</span>
              </div>
              
              <div className="relative w-full h-[100px] mb-6 rounded-xl border border-border/50 bg-background overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #b8f55a 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div className="absolute top-[30%] left-[45%] w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-primary animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-[40%] left-[70%] w-1.5 h-1.5 rounded-full bg-primary animate-ping" style={{ animationDelay: '1s' }} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">W</div>
                  <div>
                    <div className="text-xs text-white font-bold">£50 to WWF</div>
                    <div className="text-[10px] text-muted">2 mins ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">M</div>
                  <div>
                    <div className="text-xs text-white font-bold">£25 to Mind</div>
                    <div className="text-[10px] text-muted">15 mins ago</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-[1px] h-10 bg-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
}
