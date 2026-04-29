"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type AuthMode = "login" | "signup";

interface AuthContextType {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthQueryHandler({ openAuth }: { openAuth: (mode: AuthMode) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth === "login" || auth === "signup") {
      openAuth(auth as AuthMode);
      
      // Optional: Clear the search param after opening to avoid re-opening on refresh
      // const newParams = new URLSearchParams(searchParams.toString());
      // newParams.delete("auth");
      // const queryString = newParams.toString();
      // router.replace(queryString ? `?${queryString}` : window.location.pathname);
    }
  }, [searchParams, openAuth]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuth = (newMode: AuthMode) => {
    setMode(newMode);
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
  };

  return (
    <AuthContext.Provider value={{ isOpen, mode, openAuth, closeAuth }}>
      <Suspense fallback={null}>
        <AuthQueryHandler openAuth={openAuth} />
      </Suspense>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthProvider");
  }
  return context;
}
