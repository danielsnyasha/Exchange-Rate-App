'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDirectLookup } from '@/hooks/use-exchange-rate'
import { CurrencySelector } from '@/components/currency-selector'
import { ArrowRight, RefreshCw } from 'lucide-react'

export function DirectLookup() {
  const [baseCurrency, setBaseCurrency] = useState<string | null>('USD')
  const { data, isLoading, error, refetch } = useDirectLookup(baseCurrency as any)

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Direct Conversion
          </span>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Select Base Currency
          </Label>
          <CurrencySelector
            value={baseCurrency}
            onChange={setBaseCurrency}
          />
        </div>

        <div className="flex items-center justify-center py-4">
          <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
            <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            🇿🇦 ZAR Equivalent
          </Label>
          <div className="relative">
            <Input
              type="text"
              readOnly
              value={
                isLoading
                  ? 'Calculating...'
                  : error
                  ? 'Error loading rate'
                  : data
                  ? `R ${data.rate.toFixed(4)}`
                  : 'Select a currency above'
              }
              className="h-14 text-lg font-semibold text-center bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-500/5 dark:to-blue-500/5 border-emerald-200 dark:border-emerald-500/20"
            />
          </div>
        </div>

        {data && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                1 {data.base_currency} = {data.rate.toFixed(4)} {data.target_currency}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Live Rate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Updated: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
