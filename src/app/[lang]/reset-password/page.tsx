"use client";

import { useState, Suspense } from "react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useSearchParams } from "next/navigation";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { resetPassword, ApiError } from "@/lib/api";
import { LogoMark } from "@/components/ui/Logo";

function ResetPasswordForm() {
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg p-8 text-center">
        <p className="text-sm text-[#64748b] mb-4">Ongeldige of verlopen resetlink.</p>
        <Link href="/forgot-password" className="text-sm text-[#2D7BFF] font-semibold hover:underline">
          Vraag een nieuwe aan
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Wachtwoorden komen niet overeen."); return; }
    if (password.length < 8) { setError("Wachtwoord moet minimaal 8 tekens zijn."); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Deze resetlink is verlopen of al gebruikt. Vraag een nieuwe aan.");
      } else {
        setError("Er is iets misgegaan. Probeer het opnieuw.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg p-8">
      {done ? (
        <div className="text-center flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-[#0D1B2E] mb-1">Wachtwoord gewijzigd!</h2>
            <p className="text-sm text-[#64748b]">Je wordt doorgestuurd naar de inlogpagina…</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Nieuw wachtwoord</h1>
            <p className="text-sm text-[#64748b]">Kies een sterk wachtwoord van minimaal 8 tekens.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Nieuw wachtwoord</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Bevestig wachtwoord</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[#e11d48] bg-[#fff1f2] border border-[#fecdd3] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
            >
              {loading ? "Opslaan…" : "Wachtwoord opslaan"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="gradient-text">Ace</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
