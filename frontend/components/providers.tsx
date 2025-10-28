'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 10 minutes (exchange rates don't change that frequently)
            staleTime: 10 * 60 * 1000,
            // Keep unused data in cache for 15 minutes
            gcTime: 15 * 60 * 1000,
            // Don't refetch on window focus for better performance
            refetchOnWindowFocus: false,
            // Don't refetch on mount if data exists
            refetchOnMount: false,
            // Retry failed requests only once
            retry: 1,
            // Enable network mode to work offline with cached data
            networkMode: 'offlineFirst',
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  )
}
