"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, isAdmin } from "@/lib/auth";
import { PageLoader } from "@/components/ui/PageLoader";
import { useClientValue } from "@/lib/useClientValue";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const loggedIn = useClientValue(() => isLoggedIn(), false);
  const admin = useClientValue(() => isAdmin(), false);

  useEffect(() => {
    if (!loggedIn) {
      router.replace("/login");
    } else if (!admin) {
      router.replace("/dashboard");
    }
  }, [loggedIn, admin, router]);

  if (!loggedIn || !admin) return <PageLoader />;

  return <>{children}</>;
}
