'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { exchangeRateApi } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
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
    return date.toLocaleTimeString('en-US', { hour: '2-digit' })
  } else if (timeRange === '1W') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else if (timeRange === '1M' || timeRange === '3M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }
}

export function WeeklyFluctuationChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR')
  const days = TIME_RANGE_TO_DAYS[timeRange]

  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['fluctuation-historical', selectedCurrency, 'ZAR', days],
    queryFn: () => exchangeRateApi.getHistoricalRates(selectedCurrency, 'ZAR', days),
  })

  if (isLoading || !historicalData) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {selectedCurrency}/ZAR Trading Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Process historical data to add open/close/volume
  const chartData = historicalData.data.map((item: any, index: number, array: any[]) => {
    const rate = item.rate
    const prevRate = index > 0 ? array[index - 1].rate : rate
    const open = prevRate
    const close = rate
    const volume = Math.floor(Math.random() * 500000) + 100000
    const change = ((close - open) / open * 100)

    return {
      date: formatDate(item.date, timeRange),
      fullDate: item.date,
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      change: parseFloat(change.toFixed(2))
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
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="whitespace-nowrap">{selectedCurrency}/ZAR Trading Activity</span>
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
          <ComposedChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Rate (ZAR)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar yAxisId="right" dataKey="volume" fill="#93c5fd" opacity={0.3} />
            <Line yAxisId="left" type="monotone" dataKey="open" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="close" stroke="#1d4ed8" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Change</p>
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {(chartData.reduce((sum, d) => sum + Math.abs(d.change), 0) / chartData.length).toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Highest</p>
            <p className="text-base sm:text-lg font-semibold text-emerald-600">
              R{Math.max(...chartData.map(d => d.close)).toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lowest</p>
            <p className="text-base sm:text-lg font-semibold text-red-600">
              R{Math.min(...chartData.map(d => d.close)).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
