"use client";

import { useState, Suspense } from "react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useSearchParams } from "next/navigation";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, register, resendVerification, ApiError } from "@/lib/api";
import { LogoMark } from "@/components/ui/Logo";
import { useT } from "@/lib/i18n";

type Mode = "login" | "register";

const UI = {
  en: {
    login: "Log in",
    signup: "Sign up",
    welcome: "Welcome back",
    create: "Create your account",
    loginSub: "Log in to continue your practice.",
    createSub: "Start with 5 free tests, no credit card needed.",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    wait: "Please wait...",
    createAccount: "Create account",
    terms: "By creating an account, you agree to our",
    termsLink: "Terms of Service",
    and: "and",
    privacy: "Privacy Policy",
    noAccount: "Don't have an account? ",
    hasAccount: "Already have an account? ",
    signupFree: "Sign up free",
    serviceDown: "Service temporarily unavailable. Please try again in 30 seconds.",
    verify: "Please verify your email before logging in.",
    invalid: "Invalid email or password.",
    duplicate: "This email address is already in use.",
    details: "Please check your details and try again.",
    generic: "Something went wrong. Please try again.",
    network: "Could not connect to the server. Check your internet connection.",
    retry: "Try again",
    resent: "Verification email resent. Check your inbox.",
    resend: "Resend email",
  },
  nl: {
    login: "Inloggen",
    signup: "Registreren",
    welcome: "Welkom terug",
    create: "Maak je account aan",
    loginSub: "Log in om verder te oefenen.",
    createSub: "Start met 5 gratis tests, geen creditcard nodig.",
    fullName: "Volledige naam",
    email: "E-mail",
    password: "Wachtwoord",
    forgot: "Wachtwoord vergeten?",
    wait: "Even geduld...",
    createAccount: "Account aanmaken",
    terms: "Door een account aan te maken ga je akkoord met onze",
    termsLink: "Algemene voorwaarden",
    and: "en",
    privacy: "Privacyverklaring",
    noAccount: "Nog geen account? ",
    hasAccount: "Heb je al een account? ",
    signupFree: "Gratis registreren",
    serviceDown: "Service tijdelijk niet bereikbaar. Probeer het over 30 seconden opnieuw.",
    verify: "Verifieer je e-mail voordat je inlogt.",
    invalid: "Ongeldig e-mailadres of wachtwoord.",
    duplicate: "Dit e-mailadres is al in gebruik.",
    details: "Controleer je gegevens en probeer het opnieuw.",
    generic: "Er is iets misgegaan. Probeer het opnieuw.",
    network: "Kan geen verbinding maken met de server. Controleer je internetverbinding.",
    retry: "Opnieuw proberen",
    resent: "Verificatiemail opnieuw verstuurd. Controleer je inbox.",
    resend: "Mail opnieuw sturen",
  },
};

function LoginForm() {
  const router = useLocaleRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { locale } = useT();
  const ui = UI[locale];
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
        queryClient.clear();
        if (from && from.startsWith("/") && !from.startsWith("//") && from !== "/login") router.push(from);
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
          setError(ui.serviceDown);
        } else if (err.status === 403) {
          setIsUnverified(true);
          setResendEmail(email);
          setError(ui.verify);
        } else if (err.status === 401) {
          setError(ui.invalid);
        } else if (err.status === 409) {
          setError(ui.duplicate);
        } else if (err.status === 400) {
          setError(ui.details);
        } else {
          setError(ui.generic);
        }
      } else {
        setError(ui.network);
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
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="gradient-text">Ace</span>
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
                  {m === "login" ? ui.login : ui.signup}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">
                {mode === "login" ? ui.welcome : ui.create}
              </h1>
              <p className="text-sm text-[#64748b]">
                {mode === "login"
                  ? ui.loginSub
                  : ui.createSub}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ui.fullName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pierre"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">{ui.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#475569]">{ui.password}</label>
                  {mode === "login" && (
                    <Link href="/forgot-password" className="text-xs text-[#2D7BFF] hover:underline">
                      {ui.forgot}
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

              {error && (
                <div className="rounded-lg bg-[#fff1f2] border border-[#fecdd3] px-3 py-2.5 flex items-start justify-between gap-3">
                  <p className="text-xs text-[#e11d48] leading-relaxed">{error}</p>
                  {isServiceDown && (
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="flex-shrink-0 text-xs font-semibold text-[#2D7BFF] hover:underline whitespace-nowrap"
                    >
                      {ui.retry}
                    </button>
                  )}
                  {isUnverified && (
                    <button
                      type="button"
                      onClick={async () => {
                        await resendVerification(resendEmail);
                        setError(ui.resent);
                        setIsUnverified(false);
                      }}
                      className="flex-shrink-0 text-xs font-semibold text-[#2D7BFF] hover:underline whitespace-nowrap"
                    >
                      {ui.resend}
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
              >
                {loading ? ui.wait : mode === "login" ? ui.login : ui.createAccount}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>

            {mode === "register" && (
              <p className="text-xs text-[#94a3b8] text-center mt-4 leading-relaxed">
                {ui.terms}{" "}
                <span className="text-[#2D7BFF] cursor-pointer hover:underline">{ui.termsLink}</span>{" "}
                {ui.and}{" "}
                <span className="text-[#2D7BFF] cursor-pointer hover:underline">{ui.privacy}</span>.
              </p>
            )}
          </div>

          <p className="text-center text-sm text-[#64748b] mt-4">
            {mode === "login" ? ui.noAccount : ui.hasAccount}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#2D7BFF] font-semibold hover:underline"
            >
              {mode === "login" ? ui.signupFree : ui.login}
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
