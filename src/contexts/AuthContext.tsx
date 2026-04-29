"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthMode = "login" | "signup";

interface AuthContextType {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
