import { prisma } from '@/lib/prisma'

interface HistoricalRate {
  date: string
  rate: number
}

export class ExchangeRateService {
  private baseUrl = 'https://api.exchangerate-api.com/v4'
  private cacheTtl = 600 // 10 minutes in seconds

  async getAllRatesFromZAR(): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${this.baseUrl}/latest/ZAR`, {
        next: { revalidate: this.cacheTtl }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const data = await response.json()
      return data.rates || {}
    } catch (error) {
      throw new Error(`Failed to fetch batch rates: ${error}`)
    }
  }

  async getRate(baseCurrency: string, targetCurrency: string): Promise<number> {
    // Check database cache first
    const cached = await prisma.exchangeRateCache.findUnique({
      where: {
        baseCurrency_targetCurrency: {
          baseCurrency,
          targetCurrency
        }
      }
    })

    if (cached && cached.expiresAt > new Date()) {
      return cached.rate
    }

    // If converting TO ZAR, try to use batch rates
    if (targetCurrency === 'ZAR') {
      try {
        const allRates = await this.getAllRatesFromZAR()
        if (allRates[baseCurrency] && allRates[baseCurrency] > 0) {
          const rate = 1.0 / allRates[baseCurrency]

          // Cache the result
          await this.cacheRate(baseCurrency, targetCurrency, rate)

          return rate
        }
      } catch {
        // Fall through to individual fetch
      }
    }

    // Individual fetch
    try {
      const response = await fetch(`${this.baseUrl}/latest/${baseCurrency}`, {
        next: { revalidate: this.cacheTtl }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate')
      }

      const data = await response.json()
      const rate = data.rates?.[targetCurrency]

      if (!rate) {
        throw new Error(`Rate for ${targetCurrency} not found`)
      }

      // Cache the result
      await this.cacheRate(baseCurrency, targetCurrency, rate)

      return rate
    } catch (error) {
      throw new Error(`Failed to fetch exchange rate: ${error}`)
    }
  }

  private async cacheRate(
    baseCurrency: string,
    targetCurrency: string,
    rate: number
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.cacheTtl * 1000)

      await prisma.exchangeRateCache.upsert({
        where: {
          baseCurrency_targetCurrency: {
            baseCurrency,
            targetCurrency
          }
        },
        update: {
          rate,
          fetchedAt: new Date(),
          expiresAt
        },
        create: {
          baseCurrency,
          targetCurrency,
          rate,
          expiresAt
        }
      })
    } catch (error) {
      console.error('Failed to cache rate:', error)
    }
  }

  async getHistoricalRates(
    baseCurrency: string,
    targetCurrency: string,
    days: number
  ): Promise<HistoricalRate[]> {
    try {
      const currentRate = await this.getRate(baseCurrency, targetCurrency)

      // Generate historical data (simulated)
      const historicalData: HistoricalRate[] = []
      const today = new Date()

      for (let i = days; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const variation = (Math.random() - 0.5) * 0.1 // -5% to +5%
        const trendFactor = 1 + (Math.random() - 0.5) * 0.2 * (i / Math.max(days, 1))
        const rate = currentRate * (1 + variation) * trendFactor

        historicalData.push({
          date: date.toISOString().split('T')[0],
          rate: Math.round(rate * 10000) / 10000
        })
      }

      return historicalData
    } catch (error) {
      throw new Error(`Error generating historical data: ${error}`)
    }
  }
}

export const exchangeRateService = new ExchangeRateService()
