'use client'

import { cn } from '@/lib/utils'

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | '10Y'

interface TimeRangeSelectorProps {
  selected: TimeRange
  onChange: (range: TimeRange) => void
  className?: string
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
  { value: '5Y', label: '5Y' },
  { value: '10Y', label: '10Y' },
]

export function TimeRangeSelector({ selected, onChange, className }: TimeRangeSelectorProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-sm rounded-xl p-1 sm:p-1.5 border border-slate-700/50 shadow-lg overflow-x-auto scrollbar-hide w-full sm:w-auto',
      className
    )}>
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'relative px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out min-w-[40px] sm:min-w-[50px] flex-shrink-0',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
            selected === range.value
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 scale-105 z-10'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80 hover:scale-102 active:scale-95'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
