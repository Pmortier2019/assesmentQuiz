"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { resendVerification } from "@/lib/api";
import { useState } from "react";
import { LogoMark } from "@/components/ui/Logo";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resent, setResent] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="text-[#2D7BFF]">Ace</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF1FF] flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-[#2D7BFF]" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-3">Check your inbox</h1>
          <p className="text-[#64748b] mb-2">
            We sent a verification link to
          </p>
          {email && (
            <p className="font-semibold text-[#0D1B2E] mb-6">{email}</p>
          )}
          <p className="text-sm text-[#64748b] mb-8">
            Click the link in the email to activate your account. It expires in 24 hours.
          </p>

          {!resent ? (
            <button
              onClick={async () => {
                if (email) {
                  await resendVerification(email);
                  setResent(true);
                }
              }}
              className="text-sm text-[#2D7BFF] hover:underline font-semibold"
            >
              Didn&apos;t receive it? Resend
            </button>
          ) : (
            <p className="text-sm text-[#16a34a] font-semibold">Email resent — check your inbox.</p>
          )}

          <p className="mt-8 text-xs text-[#94a3b8]">
            Wrong address?{" "}
            <Link href="/login" className="text-[#2D7BFF] hover:underline">
              Go back
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}
