import { NextResponse } from 'next/server'
import { getAllCurrencies } from '@/lib/data/currency-data'

export async function GET() {
  try {
    const currencies = getAllCurrencies()
    return NextResponse.json({ currencies })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    )
  }
}
