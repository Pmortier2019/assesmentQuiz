"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useT } from "@/lib/i18n";

interface ErrorStateProps {
  /** Optional override for the body text; falls back to a generic message. */
  description?: string;
  /** When provided, renders a retry button wired to this handler. */
  onRetry?: () => void;
}

/**
 * Inline "something went wrong" block with an optional retry button. Use inside
 * a section/card when only part of the page failed to load.
 */
export function ErrorState({ description, onRetry }: ErrorStateProps) {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
        <AlertTriangle size={26} className="text-rose-500" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-lg text-default mb-1">
          {t("error_title")}
        </h2>
        <p className="text-sm text-muted max-w-xs">
          {description ?? t("error_desc")}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D7BFF] text-white text-sm font-semibold hover:bg-[#1D63E6] transition-colors"
        >
          <RotateCcw size={15} />
          {t("error_retry")}
        </button>
      )}
    </div>
  );
}

/**
 * Full-screen error fallback, mirroring PageLoader. Used when a whole route
 * fails to load (page-level data error or a render crash via error.tsx).
 */
export function PageError({ description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen bg-surface-subtle items-center justify-center px-4">
      <ErrorState description={description} onRetry={onRetry} />
    </div>
  );
}
