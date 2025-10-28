import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeRange } from '@/components/time-range-selector'

interface UIState {
  // Selected currencies
  selectedBaseCurrency: string | null
  setSelectedBaseCurrency: (currency: string) => void

  // Time ranges for charts
  exchangeRateTimeRange: TimeRange
  volatilityTimeRange: TimeRange
  fluctuationTimeRange: TimeRange

  setExchangeRateTimeRange: (range: TimeRange) => void
  setVolatilityTimeRange: (range: TimeRange) => void
  setFluctuationTimeRange: (range: TimeRange) => void

  // Loading states
  isLoadingRates: boolean
  setIsLoadingRates: (loading: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Default states
      selectedBaseCurrency: null,
      exchangeRateTimeRange: '1M',
      volatilityTimeRange: '1W',
      fluctuationTimeRange: '1W',
      isLoadingRates: false,

      // Actions
      setSelectedBaseCurrency: (currency) => set({ selectedBaseCurrency: currency }),
      setExchangeRateTimeRange: (range) => set({ exchangeRateTimeRange: range }),
      setVolatilityTimeRange: (range) => set({ volatilityTimeRange: range }),
      setFluctuationTimeRange: (range) => set({ fluctuationTimeRange: range }),
      setIsLoadingRates: (loading) => set({ isLoadingRates: loading }),
    }),
    {
      name: 'zar-exchange-ui-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        exchangeRateTimeRange: state.exchangeRateTimeRange,
        volatilityTimeRange: state.volatilityTimeRange,
        fluctuationTimeRange: state.fluctuationTimeRange,
      }),
    }
  )
)
