export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  flag: string
}

export const CURRENCY_INFO: Record<string, Omit<CurrencyInfo, 'code'>> = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  DKK: { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  EGP: { name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  PLN: { name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  SAR: { name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' }
}

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF']

export function getAllCurrencies(): CurrencyInfo[] {
  return Object.entries(CURRENCY_INFO).map(([code, info]) => ({
    code,
    ...info
  }))
}

export function getCurrencyInfo(code: string): CurrencyInfo | null {
  const info = CURRENCY_INFO[code]
  if (!info) return null
  return { code, ...info }
}
