import { NextRequest, NextResponse } from 'next/server'
import { exchangeRateService } from '@/lib/services/exchange-rate-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ base_currency: string; target_currency: string }> }
) {
  try {
    const { base_currency, target_currency } = await params
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30', 10)

    if (!base_currency || !target_currency) {
      return NextResponse.json(
        { error: 'base_currency and target_currency are required' },
        { status: 400 }
      )
    }

    const historicalData = await exchangeRateService.getHistoricalRates(
      base_currency,
      target_currency,
      days
    )

    return NextResponse.json({
      base_currency,
      target_currency,
      data: historicalData
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
