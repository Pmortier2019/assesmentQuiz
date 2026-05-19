"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    } else {
      setReady(true);
    }
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#64748b]">Loading…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
