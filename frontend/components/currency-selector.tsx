'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

interface CurrencySelectorProps {
  value: string | null
  onChange: (currency: string) => void
}

// Main currencies as per VOSS document requirements
const MAIN_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
]

// Additional currencies available via search
const ALL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
]

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCurrency = ALL_CURRENCIES.find(c => c.code === value)

  const filteredCurrencies = search
    ? ALL_CURRENCIES.filter(currency =>
        currency.code.toLowerCase().includes(search.toLowerCase()) ||
        currency.name.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const handleSelect = (code: string) => {
    onChange(code)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 flex items-center justify-between gap-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
      >
        {selectedCurrency ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedCurrency.flag}</span>
            <div className="text-left">
              <div className="font-semibold text-slate-900 dark:text-white">
                {selectedCurrency.code}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCurrency.name}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-slate-400">Select currency...</span>
        )}
        <ChevronDown className={cn(
          "h-5 w-5 text-slate-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currencies..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-80 overflow-y-auto">
            {/* Main Currencies (shown by default) */}
            {!search && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                  Main Currencies
                </div>
                {MAIN_CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleSelect(currency.code)}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors",
                      value === currency.code && "bg-emerald-50 dark:bg-emerald-500/10"
                    )}
                  >
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {currency.code}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {currency.name}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{currency.symbol}</span>
                    {value === currency.code && (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                ))}
                <div className="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  Type to search for more currencies
                </div>
              </div>
            )}

            {/* Search Results */}
            {search && (
              <div>
                {filteredCurrencies.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No currencies found
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                      Search Results ({filteredCurrencies.length})
                    </div>
                    {filteredCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleSelect(currency.code)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors",
                          value === currency.code && "bg-emerald-50 dark:bg-emerald-500/10"
                        )}
                      >
                        <span className="text-2xl">{currency.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {currency.code}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {currency.name}
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">{currency.symbol}</span>
                        {value === currency.code && (
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
