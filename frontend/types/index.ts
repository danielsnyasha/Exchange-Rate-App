export interface DirectLookupResponse {
  base_currency: string
  target_currency: string
  rate: number
  timestamp: string
}

export interface NaturalLanguageResponse {
  base_currency: string
  target_currency: string
  target_currency_amount: number
  friendly_response: string
  timestamp: string
}

export interface ExchangeRateRequest {
  base_currency: string
  target_currency: string
}

export interface NaturalLanguageRequest {
  query: string
}
