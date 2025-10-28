'use client'

import { useQuery } from '@tanstack/react-query'
import { exchangeRateApi } from '@/lib/api-client'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export function StatsCards() {
  const { data: usdData, isLoading: usdLoading } = useQuery({
    queryKey: ['stats-rate', 'USD'],
    queryFn: () => exchangeRateApi.getDirectRate('USD', 'ZAR'),
    refetchInterval: 60000, // Refresh every minute
  })

  const { data: eurData, isLoading: eurLoading } = useQuery({
    queryKey: ['stats-rate', 'EUR'],
    queryFn: () => exchangeRateApi.getDirectRate('EUR', 'ZAR'),
    refetchInterval: 60000,
  })

  const { data: gbpData, isLoading: gbpLoading } = useQuery({
    queryKey: ['stats-rate', 'GBP'],
    queryFn: () => exchangeRateApi.getDirectRate('GBP', 'ZAR'),
    refetchInterval: 60000,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* USD Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              USD
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm opacity-90">US Dollar</p>
            {usdLoading ? (
              <div className="h-9 w-24 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">
                {usdData ? `R ${usdData.rate.toFixed(2)}` : '—'}
              </p>
            )}
            <p className="text-xs opacity-80 flex items-center gap-1">
              Live Rate
            </p>
          </div>
        </div>
      </div>

      {/* EUR Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              EUR
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm opacity-90">Euro</p>
            {eurLoading ? (
              <div className="h-9 w-24 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">
                {eurData ? `R ${eurData.rate.toFixed(2)}` : '—'}
              </p>
            )}
            <p className="text-xs opacity-80 flex items-center gap-1">
              Live Rate
            </p>
          </div>
        </div>
      </div>

      {/* GBP Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              GBP
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm opacity-90">British Pound</p>
            {gbpLoading ? (
              <div className="h-9 w-24 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold">
                {gbpData ? `R ${gbpData.rate.toFixed(2)}` : '—'}
              </p>
            )}
            <p className="text-xs opacity-80 flex items-center gap-1">
              Live Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
