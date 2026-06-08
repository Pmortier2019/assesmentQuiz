"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { logout } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loggedIn, isAdmin: userIsAdmin } = useAuth();
  const router = useRouter();
  const { t } = useT();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.replace("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-md border-b border-line"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-default text-lg tracking-tight">
              Ready to <span className="gradient-text">Ace</span>
            </span>
          </Link>
          {userIsAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold hover:bg-amber-200 transition-colors"
            >
              <ShieldCheck size={12} />
              ADMIN
            </Link>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tests" className="text-sm font-medium text-body hover:text-default transition-colors">
              {t("nav_tests")}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-body hover:text-default transition-colors">
              {t("nav_pricing")}
            </Link>
            {loggedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-body hover:text-default transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-[#e11d48] transition-colors"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-body hover:text-default transition-colors">
                  {t("nav_login")}
                </Link>
                <Link
                  href="/onboarding"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                >
                  {t("nav_start")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-body hover:bg-surface-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-4">
            <Link href="/tests" className="text-sm font-medium text-body hover:text-default" onClick={() => setMobileOpen(false)}>
              {t("nav_tests")}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-body hover:text-default" onClick={() => setMobileOpen(false)}>
              {t("nav_pricing")}
            </Link>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-[#e11d48] hover:text-rose-700"
              >
                <LogOut size={15} />
                Log out
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-body hover:text-default" onClick={() => setMobileOpen(false)}>
                  {t("nav_login")}
                </Link>
                <Link
                  href="/onboarding"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav_start")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
