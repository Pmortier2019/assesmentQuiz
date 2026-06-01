"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { PageLoader } from "@/components/ui/PageLoader";
import { useClientValue } from "@/lib/useClientValue";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const loggedIn = useClientValue(() => isLoggedIn(), false);

  useEffect(() => {
    if (!loggedIn) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [loggedIn, router, pathname]);

  if (!loggedIn) return <PageLoader />;

  return <>{children}</>;
}
