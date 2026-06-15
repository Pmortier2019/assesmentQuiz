"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useAuth } from "@/lib/useAuth";

export function FooterNav() {
  const { loggedIn } = useAuth();
  return (
    <div className="flex items-center gap-6 text-sm text-[#94a3b8]">
      <Link href="/tests" className="hover:text-[#475569] transition-colors">Tests</Link>
      <Link href="/pricing" className="hover:text-[#475569] transition-colors">Pricing</Link>
      {loggedIn ? (
        <Link href="/dashboard" className="hover:text-[#475569] transition-colors">Dashboard</Link>
      ) : (
        <Link href="/login" className="hover:text-[#475569] transition-colors">Login</Link>
      )}
      <Link href="/terms" className="hover:text-[#475569] transition-colors">Terms</Link>
      <Link href="/privacy" className="hover:text-[#475569] transition-colors">Privacy</Link>
    </div>
  );
}
