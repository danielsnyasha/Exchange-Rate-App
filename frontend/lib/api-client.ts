import axios from 'axios'
import type {
  DirectLookupResponse,
  NaturalLanguageResponse,
  ExchangeRateRequest,
  NaturalLanguageRequest,
} from '@/types'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const exchangeRateApi = {
  // Direct lookup endpoint
  getDirectRate: async (
    baseCurrency: string,
    targetCurrency: string = 'ZAR'
  ): Promise<DirectLookupResponse> => {
    const response = await apiClient.post<DirectLookupResponse>(
      '/api/v1/exchange/direct',
      {
        base_currency: baseCurrency,
        target_currency: targetCurrency,
      } as ExchangeRateRequest
    )
    return response.data
  },

  // Natural language lookup endpoint
  getNaturalLanguageRate: async (
    query: string
  ): Promise<NaturalLanguageResponse> => {
    const response = await apiClient.post<NaturalLanguageResponse>(
      '/api/v1/exchange/nlp',
      {
        query,
      } as NaturalLanguageRequest
    )
    return response.data
  },

  // Historical rates endpoint
  getHistoricalRates: async (
    baseCurrency: string,
    targetCurrency: string = 'ZAR',
    days: number = 30
  ) => {
    const response = await apiClient.get(
      `/api/v1/exchange/historical/${baseCurrency}/${targetCurrency}`,
      {
        params: { days }
      }
    )
    return response.data
  },
}

export default apiClient
