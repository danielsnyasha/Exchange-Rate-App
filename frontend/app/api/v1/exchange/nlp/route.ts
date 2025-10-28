import { NextRequest, NextResponse } from 'next/server'
import { exchangeRateService } from '@/lib/services/exchange-rate-service'
import { llmService } from '@/lib/services/llm-service'
import { prisma } from '@/lib/prisma'

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      )
    }

    // Extract currency from query
    const baseCurrency = await llmService.extractCurrencyFromQuery(query)

    if (!baseCurrency) {
      // Generate friendly error message
      const friendlyMessage = await llmService.generateUnsupportedCurrencyResponse(
        query,
        SUPPORTED_CURRENCIES
      )

      // Log the failed query
      await prisma.queryLog.create({
        data: {
          query,
          queryType: 'nlp',
          success: false,
          errorMessage: 'Currency not recognized'
        }
      })

      return NextResponse.json(
        {
          error: 'currency_not_recognized',
          message: friendlyMessage,
          supported_currencies: SUPPORTED_CURRENCIES,
          examples: [
            'What is the USD to ZAR rate?',
            'Convert EUR to ZAR',
            'How much is the British pound in rands?'
          ]
        },
        { status: 400 }
      )
    }

    // Get exchange rate
    const rate = await exchangeRateService.getRate(baseCurrency, 'ZAR')

    // Generate friendly response
    const friendlyResponse = await llmService.generateFriendlyResponse(
      baseCurrency,
      'ZAR',
      rate
    )

    // Log the successful query
    await prisma.queryLog.create({
      data: {
        query,
        queryType: 'nlp',
        baseCurrency,
        targetCurrency: 'ZAR',
        rate,
        success: true
      }
    })

    return NextResponse.json({
      base_currency: baseCurrency,
      target_currency: 'ZAR',
      target_currency_amount: rate,
      friendly_response: friendlyResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log the failed query
    try {
      const body = await request.json()
      await prisma.queryLog.create({
        data: {
          query: body.query || 'unknown',
          queryType: 'nlp',
          success: false,
          errorMessage
        }
      })
    } catch {}

    return NextResponse.json(
      {
        error: 'server_error',
        message: 'An unexpected error occurred while processing your request. Please try again.',
        supported_currencies: SUPPORTED_CURRENCIES
      },
      { status: 500 }
    )
  }
}
