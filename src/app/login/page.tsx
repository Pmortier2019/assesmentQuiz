"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { login, register } from "@/lib/api";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Mortier <span className="gradient-text">Asses</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg p-8">
            {/* Toggle */}
            <div className="flex bg-[#f1f5f9] rounded-xl p-1 mb-8">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m
                      ? "bg-white text-[#0D1B2E] shadow-sm"
                      : "text-[#64748b] hover:text-[#475569]"
                  }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-[#64748b]">
                {mode === "login"
                  ? "Log in to continue your practice."
                  : "Start with 5 free tests — no credit card needed."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pierre Mortier"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#475569]">Password</label>
                  {mode === "login" && (
                    <button type="button" className="text-xs text-[#4f46e5] hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
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

              {error && (
                <p className="text-xs text-[#e11d48] bg-[#fff1f2] border border-[#fecdd3] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
              >
                {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>

            {mode === "register" && (
              <p className="text-xs text-[#94a3b8] text-center mt-4 leading-relaxed">
                By creating an account, you agree to our{" "}
                <span className="text-[#4f46e5] cursor-pointer hover:underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-[#4f46e5] cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            )}
          </div>

          <p className="text-center text-sm text-[#64748b] mt-4">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#4f46e5] font-semibold hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
