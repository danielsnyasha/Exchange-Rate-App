import { useQuery, useMutation } from '@tanstack/react-query'
import { exchangeRateApi } from '@/lib/api-client'
import type { Currency } from '@/types'

// Hook for direct lookup
export function useDirectLookup(baseCurrency: Currency | null) {
  return useQuery({
    queryKey: ['exchange-rate', 'direct', baseCurrency],
    queryFn: () => exchangeRateApi.getDirectRate(baseCurrency as string, 'ZAR'),
    enabled: !!baseCurrency,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for natural language lookup
export function useNaturalLanguageLookup() {
  return useMutation({
    mutationFn: (query: string) => exchangeRateApi.getNaturalLanguageRate(query),
  })
}
