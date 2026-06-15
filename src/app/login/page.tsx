"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, register, resendVerification, ApiError } from "@/lib/api";
import { LogoMark } from "@/components/ui/Logo";

type Mode = "login" | "register";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isServiceDown, setIsServiceDown] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setIsServiceDown(false);
    setIsUnverified(false);
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(email, password);
        if (from && from !== "/login") router.push(from);
        else if (!user.targetRole) router.push("/onboarding");
        else router.push("/dashboard");
      } else {
        await register(name, email, password);
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0 || err.status === 502 || err.status === 503) {
          setIsServiceDown(true);
          setError("Service temporarily unavailable. Please try again in 30 seconds.");
        } else if (err.status === 403) {
          setIsUnverified(true);
          setResendEmail(email);
          setError("Please verify your email before logging in.");
        } else if (err.status === 401) {
          setError("Invalid email or password.");
        } else if (err.status === 409) {
          setError("This email address is already in use.");
        } else if (err.status === 400) {
          setError("Please check your details and try again.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Could not connect to the server. Check your internet connection.");
      }
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
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#2F5233]">
              Ready to <span className="text-[#EF96BD]">Ace</span>
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
                    placeholder="Pierre"
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
                    <Link href="/forgot-password" className="text-xs text-[#4f46e5] hover:underline">
                      Forgot password?
                    </Link>
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
                <div className="rounded-lg bg-[#fff1f2] border border-[#fecdd3] px-3 py-2.5 flex items-start justify-between gap-3">
                  <p className="text-xs text-[#e11d48] leading-relaxed">{error}</p>
                  {isServiceDown && (
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="flex-shrink-0 text-xs font-semibold text-[#4f46e5] hover:underline whitespace-nowrap"
                    >
                      Try again
                    </button>
                  )}
                  {isUnverified && (
                    <button
                      type="button"
                      onClick={async () => {
                        await resendVerification(resendEmail);
                        setError("Verification email resent. Check your inbox.");
                        setIsUnverified(false);
                      }}
                      className="flex-shrink-0 text-xs font-semibold text-[#4f46e5] hover:underline whitespace-nowrap"
                    >
                      Resend email
                    </button>
                  )}
                </div>
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
