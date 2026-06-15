"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { startCheckout } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UpgradeButton({
  label = "Upgrade to Pro",
  className,
  size = "md",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleClick() {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { checkoutUrl } = await startCheckout();
      window.location.href = checkoutUrl;
    } catch (e) {
      setError("Could not start checkout. Try again.");
      setLoading(false);
    }
  }

  const sizeClasses = {
    sm:  "px-4 py-2 text-xs",
    md:  "px-6 py-3 text-sm",
    lg:  "px-8 py-4 text-base",
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl font-semibold",
          "bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white",
          "shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity",
          sizeClasses[size],
          className
        )}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {loading ? "Redirecting…" : label}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
