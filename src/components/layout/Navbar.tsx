"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useAuthModal } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial animation
    gsap.fromTo(
      ".nav-item",
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 2.5,
      },
    );

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll handler for hash links
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links on the same page
    if (href.startsWith("/#") || href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "").replace("#", "");
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        // Close mobile menu first
        setIsMobileMenuOpen(false);

        // Use Lenis if available, otherwise use native smooth scroll
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(targetEl, {
            offset: -80, // Account for fixed navbar
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  }, []);

  const navLinks = [
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Prize Pool", href: "/#prize-pool" },
    { name: "Charities", href: "/#charities" },
    { name: "Subscribe", href: "/#subscribe" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-[90] transition-all duration-500 px-6 lg:px-24 py-6",
          isScrolled
            ? "bg-background/80 backdrop-blur-md py-4 border-b border-border"
            : "bg-transparent",
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
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="nav-item text-[13px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => openAuth("login")}
              className="nav-item text-[13px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="nav-item px-6 py-2.5 bg-primary text-background font-bold rounded-lg text-[13px] uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Join Now
            </button>
          </div>

          {/* Mobile Toggle - Only show Menu icon when closed */}
          {!isMobileMenuOpen && (
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a0a14] z-[100] flex flex-col lg:hidden"
          >
            {/* Header in menu */}
            <div className="p-8 flex items-center justify-between">
               <div className="font-serif text-2xl font-bold">
                <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Golf<span className="text-primary">Give</span>
                </a>
              </div>
              
              {/* Close Button - Now inside the overlay to stay on top */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-4xl font-serif font-bold text-white hover:text-primary transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-6 mt-12 w-full max-w-[280px]"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuth("login");
                  }}
                  className="w-full text-lg font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuth("signup");
                  }}
                  className="w-full px-10 py-5 bg-primary text-background font-bold rounded-xl text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(184,245,90,0.2)]"
                >
                  Join Now
                </button>
              </motion.div>
            </div>
            
            {/* Social / Footer in menu */}
            <div className="p-12 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-bold">
                © 2026 GOLFGIVE LTD
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
