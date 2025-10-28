import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { ExchangeRateChart } from "@/components/exchange-rate-chart";
import { CurrencyComparisonBar } from "@/components/charts/currency-comparison-bar";
import { VolatilityAreaChart } from "@/components/charts/volatility-area-chart";
import { MarketDistributionPie } from "@/components/charts/market-distribution-pie";
import { WeeklyFluctuationChart } from "@/components/charts/weekly-fluctuation-chart";
import { BarChart3, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-72 transition-all duration-300">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-emerald-600" />
                  Market Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Live exchange rate analytics and market trends
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Real-time data</span>
              </div>
            </div>

            {/* Quick Stats */}
            <StatsCards />

            {/* Main Charts Grid - 2 Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* 30-Day Trend Line Chart */}
              <ExchangeRateChart />

              {/* Currency Strength Bar Chart */}
              <CurrencyComparisonBar />
            </div>

            {/* Second Row - 2 Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Intraday Volatility Area Chart */}
              <VolatilityAreaChart />

              {/* Market Distribution Pie Chart */}
              <MarketDistributionPie />
            </div>

            {/* Full Width Chart */}
            <WeeklyFluctuationChart />

            {/* Market Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Market Status</h3>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Active</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">All markets operational</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 border border-blue-200 dark:border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Data Source</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Live API</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Real-time exchange rates</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10 border border-purple-200 dark:border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Update Freq.</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">60s</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Auto-refresh enabled</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
