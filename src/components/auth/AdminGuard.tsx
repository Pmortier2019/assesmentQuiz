"use client";

import { useEffect } from "react";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { PageLoader } from "@/components/ui/PageLoader";
import { useAuth } from "@/lib/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useLocaleRouter();
  const { status, isAdmin } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [status, isAdmin, router]);

  // Wait while the session resolves; never flash admin content to a non-admin.
  if (status !== "authenticated" || !isAdmin) return <PageLoader />;

  return <>{children}</>;
}
