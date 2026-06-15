"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { PageLoader } from "@/components/ui/PageLoader";
import { useAuth } from "@/lib/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useLocaleRouter();
  const pathname = usePathname();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  // Wait for the session to resolve (loading) and never render protected
  // content for an unauthenticated user — no flash before the redirect.
  if (status !== "authenticated") return <PageLoader />;

  return <>{children}</>;
}
