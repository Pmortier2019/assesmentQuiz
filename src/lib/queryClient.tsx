"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays "fresh" for a minute, so navigating away and back
        // (dashboard → tests → dashboard) serves from cache instead of
        // refetching on every mount.
        staleTime: 60_000,
        // Keep unused data around for 5 minutes before garbage collection.
        gcTime: 5 * 60_000,
        // Retry transient failures once; auth/permission errors are surfaced
        // by api.ts as ApiError and rarely benefit from blind retries.
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // Create the client once per browser session. Using useState (rather than a
  // module-level singleton) keeps it stable across re-renders without sharing
  // a cache between requests during SSR.
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
