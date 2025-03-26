// PROVIDERS
// This component wraps the application with the React Query provider,
// initializing a custom QueryClient with specific default settings.
// It enables consistent query caching and state management across the app.

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function Providers({ children }: React.PropsWithChildren) {
  // Initialize QueryClient only once using React.useState
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60,           // Cache garbage collection: 1 hour
            staleTime: 1000 * 60 * 60,        // Data considered fresh for: 1 hour
            refetchOnMount: false,           // Don't refetch automatically when component remounts
            refetchOnWindowFocus: false,     // Don't refetch when window gains focus
            retry: false,                    // Disable automatic retries on failure
          },
        },
      })
  );

  // Provide the QueryClient context to all children
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
