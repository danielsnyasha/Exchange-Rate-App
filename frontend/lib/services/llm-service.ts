export class LLMService {
  private ollamaUrl: string

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  }

  async extractCurrencyFromQuery(query: string): Promise<string | null> {
    // First try simple pattern matching
    const queryUpper = query.toUpperCase()

    if (queryUpper.includes('USD') || queryUpper.includes('DOLLAR')) {
      return 'USD'
    } else if (queryUpper.includes('EUR') || queryUpper.includes('EURO')) {
      return 'EUR'
    } else if (
      queryUpper.includes('GBP') ||
      queryUpper.includes('POUND') ||
      queryUpper.includes('STERLING')
    ) {
      return 'GBP'
    }

    // If pattern matching fails, try LLM
    try {
      const prompt = `Extract the currency code from this query.
Valid options: USD, EUR, GBP
Query: "${query}"
Reply with ONLY the 3-letter currency code, nothing else.`

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:8b',
          prompt,
          stream: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        const currency = data.response?.trim().toUpperCase()

        if (['USD', 'EUR', 'GBP'].includes(currency)) {
          return currency
        }
      }
    } catch (error) {
      console.error('LLM extraction failed:', error)
    }

    return null
  }

  async generateFriendlyResponse(
    baseCurrency: string,
    targetCurrency: string,
    rate: number
  ): Promise<string> {
    const currencyNames: Record<string, string> = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      ZAR: 'South African Rand'
    }

    const baseName = currencyNames[baseCurrency] || baseCurrency
    const targetName = currencyNames[targetCurrency] || targetCurrency

    // Enhanced fallback response
    const amount100 = (rate * 100).toFixed(2)
    const amount1000 = (rate * 1000).toFixed(2)
    const simpleResponse = `Right now, one ${baseName} is worth ${rate.toFixed(4)} ${targetName}. This means if you're converting money, you'll get about R${rate.toFixed(2)} for every ${baseCurrency} you exchange. For example, ${baseCurrency} 100 would give you around R${amount100}, and ${baseCurrency} 1,000 would be about R${amount1000}. These are live rates updated in real-time!`

    try {
      const prompt = `You are a helpful currency exchange assistant. Explain this exchange rate in a friendly, conversational way.

Exchange Rate Information:
- 1 ${baseName} (${baseCurrency}) = ${rate.toFixed(4)} ${targetName} (${targetCurrency})
- Data Source: Live rates from exchangerate-api.com
- This is the current, real-time exchange rate

Instructions:
- Give a clear, friendly response in 2-3 sentences
- Mention what this rate means for someone converting money
- You can mention that this is live data if it feels natural
- Be conversational and helpful, like you're talking to a friend
- Don't use technical jargon or overly formal language
- Start with something like "Right now, one ${baseName}..." or "Based on the latest rates..."
- Give a practical example (like converting 100 or 1000 units)

Response:`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:8b',
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const friendlyText = data.response?.trim()
        if (friendlyText) {
          return friendlyText
        }
      }
    } catch (error) {
      console.error('LLM generation failed (using enhanced fallback):', error)
    }

    return simpleResponse
  }

  async generateUnsupportedCurrencyResponse(
    query: string,
    supportedCurrencies: string[]
  ): Promise<string> {
    const currencyNames: Record<string, string> = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound'
    }

    const supportedList = supportedCurrencies
      .map(code => `${code} (${currencyNames[code] || code})`)
      .join(', ')

    const fallbackResponse = `I couldn't identify a supported currency in your query. Currently, I can help you with exchange rates for: ${supportedList}. Try asking something like 'What is the USD to ZAR rate?'`

    try {
      const prompt = `You are a helpful currency exchange assistant. A user asked: "${query}"

However, you can only provide exchange rates for these currencies against the South African Rand (ZAR):
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)

Your task:
1. Politely explain you can't help with their specific currency
2. List the currencies you DO support in a friendly way
3. Encourage them to ask about one of the supported currencies
4. Give an example of how they could ask
5. Be warm, conversational, and helpful - like a friendly assistant

Keep your response to 2-3 sentences. Make it feel natural and encouraging, not robotic.

Response:`

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:8b',
          prompt,
          stream: false,
          options: {
            temperature: 0.8,
            top_p: 0.9
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const friendlyText = data.response?.trim()
        if (friendlyText) {
          return friendlyText
        }
      }
    } catch (error) {
      console.error('LLM generation failed:', error)
    }

    return fallbackResponse
  }
}

export const llmService = new LLMService()
