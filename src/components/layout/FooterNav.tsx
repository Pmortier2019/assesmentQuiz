"use client";

import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";

export function FooterNav() {
  const loggedIn = typeof window !== "undefined" ? isLoggedIn() : false;
  return (
    <div className="flex items-center gap-6 text-sm text-[#94a3b8]">
      <Link href="/tests" className="hover:text-[#475569] transition-colors">Tests</Link>
      <Link href="/pricing" className="hover:text-[#475569] transition-colors">Pricing</Link>
      {loggedIn ? (
        <Link href="/dashboard" className="hover:text-[#475569] transition-colors">Dashboard</Link>
      ) : (
        <Link href="/login" className="hover:text-[#475569] transition-colors">Login</Link>
      )}
    </div>
  );
}
