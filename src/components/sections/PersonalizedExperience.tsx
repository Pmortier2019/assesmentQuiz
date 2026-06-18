"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RoleCategory } from "@/lib/types";
import { isRoleCategory } from "@/lib/professionDemo";

// Client island that holds the visitor's chosen profession so the hero headline
// and the interactive demo can react to it together. The selection persists in
// localStorage so returning visitors keep their context. Server-rendered
// children pass straight through, so only the interactive bits opt into client.

const STORAGE_KEY = "r2a:role";

interface ProfessionContextValue {
  role: RoleCategory | null;
  setRole: (role: RoleCategory | null) => void;
}

const ProfessionContext = createContext<ProfessionContextValue | null>(null);

export function ProfessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleCategory | null>(null);

  // Hydrate from localStorage after mount to avoid an SSR mismatch.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // SSR-safe hydration: we must read the browser-only store after mount, so
      // the initial render matches the server (the default, role-less copy).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && isRoleCategory(saved)) setRoleState(saved);
    } catch {
      // localStorage unavailable (private mode); fall back to the default copy.
    }
  }, []);

  const setRole = (next: RoleCategory | null) => {
    setRoleState(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, next);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Persisting is best-effort; the in-memory selection still works.
    }
  };

  return (
    <ProfessionContext.Provider value={{ role, setRole }}>
      {children}
    </ProfessionContext.Provider>
  );
}

export function useProfession(): ProfessionContextValue {
  const ctx = useContext(ProfessionContext);
  if (!ctx) throw new Error("useProfession must be used within a ProfessionProvider");
  return ctx;
}
