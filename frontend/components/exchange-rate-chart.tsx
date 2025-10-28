'use client'

import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { exchangeRateApi } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { TimeRangeSelector, TimeRange } from '@/components/time-range-selector'
import { useUIStore } from '@/stores/ui-store'

// Map time ranges to number of days
const TIME_RANGE_TO_DAYS: Record<TimeRange, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  '5Y': 1825,
  '10Y': 3650,
}

// Format date based on time range
function formatDate(dateStr: string, timeRange: TimeRange) {
  const date = new Date(dateStr)

  if (timeRange === '1D') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else if (timeRange === '1W' || timeRange === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else if (timeRange === '3M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }
}

export function ExchangeRateChart() {
  const timeRange = useUIStore((state) => state.exchangeRateTimeRange)
  const setTimeRange = useUIStore((state) => state.setExchangeRateTimeRange)
  const days = TIME_RANGE_TO_DAYS[timeRange]

  const { data: usdData, isLoading: usdLoading } = useQuery({
    queryKey: ['historical', 'USD', 'ZAR', days],
    queryFn: () => exchangeRateApi.getHistoricalRates('USD', 'ZAR', days),
  })

  const { data: eurData, isLoading: eurLoading } = useQuery({
    queryKey: ['historical', 'EUR', 'ZAR', days],
    queryFn: () => exchangeRateApi.getHistoricalRates('EUR', 'ZAR', days),
  })

  const { data: gbpData, isLoading: gbpLoading } = useQuery({
    queryKey: ['historical', 'GBP', 'ZAR', days],
    queryFn: () => exchangeRateApi.getHistoricalRates('GBP', 'ZAR', days),
  })

  const isLoading = usdLoading || eurLoading || gbpLoading

  if (isLoading || !usdData || !eurData || !gbpData) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Exchange Rate Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Merge all histories into one dataset
  const chartData = usdData.data.map((item: any, index: number) => ({
    date: formatDate(item.date, timeRange),
    fullDate: item.date,
    USD: item.rate,
    EUR: eurData.data[index]?.rate,
    GBP: gbpData.data[index]?.rate,
  }))

  // Sample data points for better performance on large datasets
  const sampledData = timeRange === '5Y' || timeRange === '10Y'
    ? chartData.filter((_: any, i: number) => i % 10 === 0)
    : timeRange === '1Y'
    ? chartData.filter((_: any, i: number) => i % 3 === 0)
    : chartData

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Exchange Rate Trends
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>Live Data</span>
            </div>
          </div>
          <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'ZAR', angle: -90, position: 'insideLeft' }}
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
            <Line
              type="monotone"
              dataKey="USD"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="EUR"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="GBP"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
