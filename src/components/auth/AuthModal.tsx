"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "@/contexts/AuthContext";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";

export function AuthModal() {
  const { isOpen, mode, closeAuth, openAuth } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError(null); // Reset errors on open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Provide success feedback
        setError("Success! Please check your email to confirm your account.");
      }
    } else {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        closeAuth();
        
        // Check user role to decide redirect destination
        if (authData?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", authData.user.id)
            .single();
          
          if (profile?.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        } else {
          window.location.href = "/dashboard";
        }
      }
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError("Google authentication is not implemented yet due to lack of time. Please use email/password for now.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 py-8 sm:p-6 lg:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md overflow-hidden bg-surface border border-border rounded-[12px] shadow-2xl relative pointer-events-auto max-h-[100dvh] overflow-y-auto my-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 p-2 text-muted hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    {mode === "login" ? "Welcome Back" : "Join GolfGive"}
                  </h2>
                  <p className="text-sm text-muted">
                    {mode === "login"
                      ? "Enter your details to access your dashboard."
                      : "Create an account to start giving and winning."}
                  </p>
                </div>

                {/* Error / Success Message */}
                {error && (
                  <div
                    className={`mb-6 p-3 text-[13px] rounded-md ${error.includes("Success") ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                  >
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-[12px] font-medium text-muted uppercase tracking-[0.08em] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#1c1c30] border border-border rounded-md px-3 py-2.5 text-white text-[13px] placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[12px] font-medium text-muted uppercase tracking-[0.08em] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1c1c30] border border-border rounded-md px-3 py-2.5 text-white text-[13px] placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[12px] font-medium text-muted uppercase tracking-[0.08em]">
                        Password
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          className="text-[11px] text-primary hover:text-white transition-colors"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1c1c30] border border-border rounded-md px-3 py-2.5 text-white text-[13px] placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-[#8bdd2a] text-background font-bold py-3 px-7 rounded-md text-[14px] tracking-[0.02em] transition-all duration-150 ease-out hover:scale-[1.02] mt-6 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 font-mono text-[11px] text-center uppercase tracking-widest text-muted flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span>OR CONTINUE WITH</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Google Auth Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="mt-6 w-full flex items-center justify-center gap-3 bg-transparent border border-border text-white py-3 px-7 rounded-md hover:border-primary hover:text-primary transition-colors group"
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${!loading && "group-hover:scale-110"}`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-bold text-[14px]">Google</span>
                </button>

                {/* Footer Link */}
                <div className="mt-8 text-center text-[13px] text-muted">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          openAuth("signup");
                          setError(null);
                        }}
                        className="text-white font-medium hover:text-primary transition-colors"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          openAuth("login");
                          setError(null);
                        }}
                        className="text-white font-medium hover:text-primary transition-colors"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
