"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { forgotPassword, ApiError } from "@/lib/api";
import { LogoMark } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        setError("Service tijdelijk niet bereikbaar. Probeer het later opnieuw.");
      } else {
        // Always show success-like message to prevent email enumeration
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

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
          {sent ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg p-8 text-center flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#0D1B2E] mb-2">Controleer je inbox</h2>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Als er een account bestaat voor <strong>{email}</strong>, ontvang je een e-mail
                  met een resetlink. De link is 1 uur geldig.
                </p>
              </div>
              <Link href="/login" className="text-sm text-[#2D7BFF] font-semibold hover:underline flex items-center gap-1">
                <ArrowLeft size={14} />
                Terug naar inloggen
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg p-8">
              <Link href="/login" className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#475569] mb-6 transition-colors">
                <ArrowLeft size={14} />
                Terug naar inloggen
              </Link>

              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#EAF1FF] flex items-center justify-center mb-4">
                  <Mail size={18} className="text-[#2D7BFF]" />
                </div>
                <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Wachtwoord vergeten?</h1>
                <p className="text-sm text-[#64748b]">
                  Vul je e-mailadres in en we sturen je een resetlink.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">E-mailadres</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jij@voorbeeld.nl"
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
                  {loading ? "Versturen…" : "Stuur resetlink"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
