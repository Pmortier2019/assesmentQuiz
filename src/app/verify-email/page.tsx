"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";
import { verifyEmail } from "@/lib/api";

type Status = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [errorMsg, setErrorMsg] = useState(
    token ? "" : "No verification token found in the link."
  );

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/onboarding"), 2000);
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("This link has expired or has already been used. Request a new one from the login page.");
      });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="text-[#4f46e5]">Ace</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-up">
          {status === "verifying" && (
            <>
              <Loader2 size={48} className="text-[#4f46e5] animate-spin mx-auto mb-6" />
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-3">Verifying your email…</h1>
              <p className="text-[#64748b]">Just a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 size={48} className="text-[#16a34a] mx-auto mb-6" />
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-3">Email verified!</h1>
              <p className="text-[#64748b]">Taking you to your account…</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="text-[#e11d48] mx-auto mb-6" />
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-3">Verification failed</h1>
              <p className="text-[#64748b] mb-6">{errorMsg}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
