"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerCacheReset } from "./auth";

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

  // Let the auth layer wipe cached per-user data on sign-in/sign-out without
  // depending on React Query. Registered before the user can trigger a
  // logout/login, so no per-account data leaks across sessions on a shared device.
  useEffect(() => {
    registerCacheReset(() => queryClient.clear());
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
