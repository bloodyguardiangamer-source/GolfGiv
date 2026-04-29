'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Lock, Shield, Heart, Loader2 } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

export function SubscriptionCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { openAuth } = useAuthModal();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    gsap.fromTo('.cta-line',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoadingPlan(plan);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in, open auth modal
        openAuth('signup');
        setLoadingPlan(null);
        return;
      }

      // Logged in, trigger checkout
      const priceId = plan === 'monthly' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

      if (!priceId) {
        throw new Error('Subscription Price ID is not configured. Please check your environment variables.');
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription: ' + error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="subscribe" ref={sectionRef} className="relative w-full py-40 px-6 bg-background overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <span className="cta-line text-[11px] uppercase tracking-[0.16em] text-muted font-bold mb-6 block">JOIN TODAY</span>
        <h2 className="cta-line font-serif text-[44px] lg:text-[80px] font-bold leading-tight mb-20">
          Join GolfGive<br />
          <span className="text-primary italic">Today.</span>
        </h2>

        <div className="cta-line flex flex-col md:flex-row justify-center gap-8 max-w-[800px] mx-auto mb-20">
          {/* Monthly */}
          <div 
            className="group relative flex-1 bg-surface border border-border rounded-2xl p-10 text-left transition-colors duration-500 hover:border-muted/50 overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
            }}
          >
            <div 
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(500px circle at var(--x) var(--y), rgba(184, 245, 90, 0.05), transparent 40%)`,
              }}
            />
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">MONTHLY</div>
              <div className="text-3xl font-bold mb-8">£9.99 <span className="text-sm font-normal text-muted">/ month</span></div>
              <ul className="space-y-4 mb-10 text-sm text-muted">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Enter monthly draws
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Support your charity
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Cancel anytime
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('monthly')}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-lg border border-border font-bold text-sm hover:bg-white hover:text-background transition-all flex items-center justify-center gap-2"
              >
                {loadingPlan === 'monthly' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  'Start Monthly'
                )}
              </button>
            </div>
          </div>

          {/* Yearly */}
          <div 
            className="group relative flex-1 bg-surface border-2 border-primary rounded-2xl p-10 text-left overflow-hidden shadow-[0_0_40px_rgba(184,245,90,0.1)] transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(184,245,90,0.2)]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
            }}
          >
            <div 
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(500px circle at var(--x) var(--y), rgba(184, 245, 90, 0.15), transparent 40%)`,
              }}
            />
            <div className="relative z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-[10px] font-bold rounded-full">
                BEST VALUE
              </div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 mt-4">YEARLY</div>
              <div className="text-3xl font-bold mb-2">£89.99 <span className="text-sm font-normal text-muted">/ year</span></div>
              <div className="text-xs text-primary font-bold mb-8">Save £30 per year</div>
              <ul className="space-y-4 mb-10 text-sm text-muted">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Everything in Monthly
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Priority draw entry
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-primary" /> Exclusive yearly badge
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('yearly')}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-lg bg-primary text-background font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(184,245,90,0.3)] hover:shadow-[0_0_30px_rgba(184,245,90,0.5)]"
              >
                {loadingPlan === 'yearly' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  'Start Yearly'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="cta-line flex flex-wrap justify-center gap-8 lg:gap-16">
          <div className="flex items-center gap-3 text-xs text-muted">
            <Lock className="w-4 h-4 text-primary" /> Secure Stripe payment
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Shield className="w-4 h-4 text-primary" /> Cancel anytime
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Heart className="w-4 h-4 text-primary" /> 10% minimum to charity
          </div>
        </div>
      </div>
    </section>
  );
}
