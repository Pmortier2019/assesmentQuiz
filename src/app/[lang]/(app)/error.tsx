"use client"; // Error boundaries must be Client Components

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { PageError } from "@/components/ui/ErrorState";

/**
 * Route-segment error boundary for all authenticated (app) pages. Catches
 * render-time crashes (uncaught exceptions) that the inline data-error states
 * don't cover, reports them to Sentry, and offers a retry.
 *
 * `unstable_retry` (Next 16.2+) re-fetches and re-renders the segment; `reset`
 * is the older fallback. The root layout — and with it LanguageProvider — stays
 * mounted above this boundary, so useT() inside PageError works.
 */
export default function AppError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <PageError onRetry={unstable_retry ?? reset} />;
}
