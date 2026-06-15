import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
  feedback?: string;
  isProUser?: boolean;
  className?: string;
}

export function FeedbackCard({ feedback, isProUser = false, className }: FeedbackCardProps) {
  if (!isProUser) {
    return (
      <div className={cn("relative rounded-2xl border border-[#e2e8f0] overflow-hidden", className)}>
        {/* blurred preview */}
        <div className="p-6 blur-sm select-none pointer-events-none opacity-50">
          <p className="text-sm text-[#475569] leading-relaxed">
            Your performance on this test shows strong analytical skills in direct calculations. However, you consistently lose points on multi-variable problems. Focus on breaking complex questions into smaller steps first...
          </p>
        </div>
        {/* overlay */}
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-6 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center">
            <Lock size={18} className="text-white" />
          </div>
          <p className="font-display font-semibold text-[#0D1B2E] text-center">
            Detailed feedback is a Pro feature
          </p>
          <Link
            href="/pricing"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-[#BFD6FF] bg-gradient-to-br from-[#EAF1FF] to-[#EAF1FF] p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-display font-semibold text-[#2D7BFF] text-sm">Detailed Feedback</span>
      </div>
      <p className="text-sm text-[#334155] leading-relaxed">
        {feedback ?? "No feedback available yet."}
      </p>
    </div>
  );
}
