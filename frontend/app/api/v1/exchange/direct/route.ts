import { NextRequest, NextResponse } from 'next/server'
import { exchangeRateService } from '@/lib/services/exchange-rate-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base_currency, target_currency = 'ZAR' } = body

    if (!base_currency) {
      return NextResponse.json(
        { error: 'base_currency is required' },
        { status: 400 }
      )
    }

    const rate = await exchangeRateService.getRate(base_currency, target_currency)

    // Log the query
    await prisma.queryLog.create({
      data: {
        query: `${base_currency} to ${target_currency}`,
        queryType: 'direct',
        baseCurrency: base_currency,
        targetCurrency: target_currency,
        rate,
        success: true
      }
    })

    return NextResponse.json({
      base_currency,
      target_currency,
      rate,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log the failed query
    try {
      const body = await request.json()
      await prisma.queryLog.create({
        data: {
          query: `${body.base_currency || 'unknown'} to ${body.target_currency || 'ZAR'}`,
          queryType: 'direct',
          baseCurrency: body.base_currency,
          targetCurrency: body.target_currency || 'ZAR',
          success: false,
          errorMessage
        }
      })
    } catch {}

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
