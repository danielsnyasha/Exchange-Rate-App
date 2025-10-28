'use client'

import { cn } from '@/lib/utils'

export type Currency = 'USD' | 'EUR' | 'GBP'

interface SimpleCurrencySelectorProps {
  selected: Currency
  onChange: (currency: Currency) => void
  className?: string
  label?: string
}

const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: 'USD', label: 'USD', flag: '🇺🇸' },
  { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
  { value: 'GBP', label: 'GBP', flag: '🇬🇧' },
]

export function SimpleCurrencySelector({ selected, onChange, className, label }: SimpleCurrencySelectorProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 w-full sm:w-auto', className)}>
      {label && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </span>
      )}
      <div className="inline-flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50 shadow-lg w-full sm:w-auto">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.value}
            onClick={() => onChange(currency.value)}
            className={cn(
              'relative px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out flex-1 sm:flex-none sm:min-w-[70px]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
              'flex items-center justify-center gap-1 sm:gap-1.5',
              selected === currency.value
                ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 scale-105 z-10'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 hover:scale-102 active:scale-95'
            )}
          >
            <span className="text-sm sm:text-base">{currency.flag}</span>
            <span className="hidden xs:inline">{currency.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
