'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNaturalLanguageLookup } from '@/hooks/use-exchange-rate'
import { Bot, Sparkles, ArrowRight } from 'lucide-react'

export function NaturalLanguageLookup() {
  const [query, setQuery] = useState('')
  const { mutate, data, isPending, error } = useNaturalLanguageLookup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      mutate(query)
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Assistant
          </span>
          <Sparkles className="h-4 w-4 text-purple-500" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ask in Natural Language
            </Label>
            <Textarea
              placeholder='Try: "Convert USD to ZAR" or "What is the GBP rate?"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="resize-none text-base hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by AI • Supports USD, EUR, GBP
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending || !query.trim()}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Exchange Rate
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        {error && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-sm">ℹ️</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">
                  {(error as any).response?.data?.message || error.message || "Unable to process your request"}
                </p>

                {(error as any).response?.data?.supported_currencies && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-400">
                      Supported Currencies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(error as any).response.data.supported_currencies.map((curr: string) => (
                        <span
                          key={curr}
                          className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-500/30"
                        >
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(error as any).response?.data?.examples && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-400">
                      Try asking:
                    </p>
                    <ul className="space-y-1">
                      {(error as any).response.data.examples.map((example: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-xs text-amber-700 dark:text-amber-300 pl-4 relative before:content-['•'] before:absolute before:left-0"
                        >
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* AI Chat-style Response */}
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-500/10 dark:via-blue-500/10 dark:to-indigo-500/10 border border-purple-200/50 dark:border-purple-500/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                        AI Assistant
                      </span>
                    </div>
                    <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      {data.friendly_response}
                    </p>
                  </div>

                  {/* Exchange Rate Card */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Exchange Rate Details
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">From</p>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {data.base_currency}
                            </p>
                          </div>
                          <span className="text-slate-400">→</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">To</p>
                        <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-500/20 dark:to-blue-500/20 border border-emerald-200 dark:border-emerald-500/30">
                          <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            R {data.target_currency_amount.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                        1 {data.base_currency} = {data.target_currency_amount.toFixed(4)} {data.target_currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
