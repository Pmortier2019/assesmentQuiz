"use client";

import { useEffect } from "react";
import { bootstrapAuth } from "@/lib/api";

/**
 * Runs once on app load to restore the session from the httpOnly refresh cookie
 * into the in-memory auth store. Renders children immediately; consumers read
 * the resolving status via useAuth() and show loaders until it settles. No
 * context value is needed — the auth store is module-global.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void bootstrapAuth();
  }, []);

  return <>{children}</>;
}
