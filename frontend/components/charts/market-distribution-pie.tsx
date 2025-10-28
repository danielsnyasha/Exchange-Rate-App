'use client'

import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { exchangeRateApi } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4']

const CURRENCY_INFO = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', color: '#3b82f6' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', color: '#10b981' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', color: '#a855f7' },
]

export function MarketDistributionPie() {
  const currencies = CURRENCY_INFO.map(c => c.code)

  const queries = currencies.map(currency =>
    useQuery({
      queryKey: ['pie-rate', currency],
      queryFn: () => exchangeRateApi.getDirectRate(currency, 'ZAR'),
    })
  )

  const allLoaded = queries.every(q => q.data)

  if (!allLoaded) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-600" />
            Market Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate relative market strength
  const totalRate = queries.reduce((sum, q) => sum + q.data!.rate, 0)
  const chartData = queries.map((q, i) => ({
    name: `${CURRENCY_INFO[i].flag} ${currencies[i]}`,
    code: currencies[i],
    value: parseFloat(((q.data!.rate / totalRate) * 100).toFixed(2)),
    rate: q.data!.rate,
    color: CURRENCY_INFO[i].color
  }))

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-600" />
            Relative Currency Strength
          </CardTitle>
          <span className="text-xs text-slate-500">vs ZAR</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value}% (R${props.payload.rate.toFixed(2)})`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {chartData.map((item, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.code}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: item.color }}>
                {item.value}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                R{item.rate.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
