"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, AlertCircle } from "lucide-react";
import { adminBootstrap } from "@/lib/api";
import { isLoggedIn, isAdmin } from "@/lib/auth";

export default function AdminBootstrapPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn() && isAdmin()) router.replace("/admin");
  }, [router]);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await adminBootstrap(email, password);
      router.replace("/admin");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Bootstrap failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
            <Zap size={15} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-[#0D1B2E]">Ready to Ace</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={20} className="text-[#4f46e5]" />
            <h1 className="font-display font-bold text-lg text-[#0D1B2E]">Admin Bootstrap</h1>
          </div>

          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
            Log in met een bestaand account om het te promoveren tot admin.
            Werkt alleen als er nog geen admin bestaat.
          </p>

          {status === "error" && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                placeholder="jouw@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Wachtwoord</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {status === "loading" ? "Bezig…" : "Maak mij admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
