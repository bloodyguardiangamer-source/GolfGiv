'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial animation
    gsap.fromTo('.nav-item', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 2.5 }
    );

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Prize Pool', href: '#prize-pool' },
    { name: 'Charities', href: '#charities' },
    { name: 'Draw', href: '#draw' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 w-full z-[90] transition-all duration-500 px-6 lg:px-24 py-6",
        isScrolled ? "bg-background/80 backdrop-blur-md py-4 border-b border-border" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="nav-item font-serif text-2xl font-bold">
          <a href="/">
            Golf<span className="text-primary">Give</span>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="nav-item text-[13px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="/login" className="nav-item text-[13px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
            Log In
          </a>
          <button className="nav-item px-6 py-2.5 bg-primary text-background font-bold rounded-lg text-[13px] uppercase tracking-widest hover:scale-105 transition-transform">
            Join Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-8 transition-all duration-500 lg:hidden",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <button 
          className="absolute top-8 right-8 text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>
        
        {navLinks.map((link) => (
          <a 
            key={link.name}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl font-serif font-bold hover:text-primary transition-colors"
          >
            {link.name}
          </a>
        ))}
        
        <div className="flex flex-col items-center gap-6 mt-8">
          <a href="/login" className="text-lg font-bold uppercase tracking-widest text-muted">Log In</a>
          <button className="px-10 py-4 bg-primary text-background font-bold rounded-lg text-lg uppercase tracking-widest">
            Join Now
          </button>
        </div>
      </div>
    </nav>
  );
}
