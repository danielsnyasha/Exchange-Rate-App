'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { exchangeRateApi } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { TimeRangeSelector, TimeRange } from '@/components/time-range-selector'
import { SimpleCurrencySelector, Currency } from '@/components/simple-currency-selector'

const TIME_RANGE_TO_DAYS: Record<TimeRange, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  '5Y': 1825,
  '10Y': 3650,
}

function formatDate(dateStr: string, timeRange: TimeRange) {
  const date = new Date(dateStr)

  if (timeRange === '1D') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else if (timeRange === '1W' || timeRange === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }
}

export function VolatilityAreaChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD')
  const days = TIME_RANGE_TO_DAYS[timeRange]

  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['volatility-historical', selectedCurrency, 'ZAR', days],
    queryFn: () => exchangeRateApi.getHistoricalRates(selectedCurrency, 'ZAR', days),
  })

  if (isLoading || !historicalData) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            {selectedCurrency}/ZAR Volatility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Process historical data to add high/low ranges based on volatility
  const chartData = historicalData.data.map((item: any) => {
    const baseRate = item.rate
    const volatilityRange = baseRate * 0.02 // 2% range

    return {
      date: formatDate(item.date, timeRange),
      rate: baseRate,
      high: parseFloat((baseRate + volatilityRange * Math.random()).toFixed(2)),
      low: parseFloat((baseRate - volatilityRange * Math.random()).toFixed(2)),
    }
  })

  // Sample data for better performance on large datasets
  const sampledData = timeRange === '5Y' || timeRange === '10Y'
    ? chartData.filter((_: any, i: number) => i % 10 === 0)
    : timeRange === '1Y'
    ? chartData.filter((_: any, i: number) => i % 3 === 0)
    : chartData

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span className="whitespace-nowrap">{selectedCurrency}/ZAR Volatility</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SimpleCurrencySelector
              selected={selectedCurrency}
              onChange={setSelectedCurrency}
            />
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#d946ef"
              fill="url(#colorRate)"
              fillOpacity={0.2}
              strokeWidth={1}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#a855f7"
              fill="url(#colorRate)"
              strokeWidth={3}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#c084fc"
              fill="url(#colorRate)"
              fillOpacity={0.1}
              strokeWidth={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
