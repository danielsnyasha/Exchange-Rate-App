import httpx
import re
from typing import Tuple, Optional


class LLMService:
    """Service for interacting with Ollama LLM for natural language processing"""

    def __init__(self, ollama_url: str = None):
        # Use host.docker.internal when running in Docker, localhost otherwise
        if ollama_url is None:
            import os
            ollama_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")
        self.ollama_url = ollama_url
        self.model = "llama3:8b"

    async def extract_currency_from_query(self, query: str) -> Optional[str]:
        """
        Extract currency code from natural language query using LLM

        Args:
            query: Natural language query from user

        Returns:
            Currency code (USD, EUR, GBP) or None
        """
        # First try simple regex pattern matching (faster)
        query_upper = query.upper()
        if "USD" in query_upper or "DOLLAR" in query_upper:
            return "USD"
        elif "EUR" in query_upper or "EURO" in query_upper:
            return "EUR"
        elif "GBP" in query_upper or "POUND" in query_upper or "STERLING" in query_upper:
            return "GBP"

        # If pattern matching fails, use LLM
        try:
            prompt = f"""Extract the currency code from this query.
Valid options: USD, EUR, GBP
Query: "{query}"
Reply with ONLY the 3-letter currency code, nothing else."""

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    currency = result.get("response", "").strip().upper()

                    # Validate the response
                    if currency in ["USD", "EUR", "GBP"]:
                        return currency

        except Exception:
            pass

        return None

    async def generate_friendly_response(
        self, base_currency: str, target_currency: str, rate: float
    ) -> str:
        """
        Generate a friendly natural language response

        Args:
            base_currency: The base currency code
            target_currency: The target currency code
            rate: The exchange rate

        Returns:
            Friendly response string
        """
        # If Ollama is not available, return a simple response
        simple_response = f"The current exchange rate is {rate:.4f} {target_currency} per 1 {base_currency}."

        # Currency names for better context
        currency_names = {
            "USD": "US Dollar",
            "EUR": "Euro",
            "GBP": "British Pound",
            "ZAR": "South African Rand"
        }

        base_name = currency_names.get(base_currency, base_currency)
        target_name = currency_names.get(target_currency, target_currency)

        try:
            prompt = f"""You are a helpful currency exchange assistant. Explain this exchange rate in a friendly, conversational way.

Exchange Rate Information:
- 1 {base_name} ({base_currency}) = {rate:.4f} {target_name} ({target_currency})
- Data Source: Live rates from openrates.io
- This is the current, real-time exchange rate

Instructions:
- Give a clear, friendly response in 2-3 sentences
- Mention what this rate means for someone converting money
- You can mention that this is live data from openrates.io if it feels natural
- Be conversational and helpful, like you're talking to a friend
- Don't use technical jargon or overly formal language
- Start with something like "Right now, one {base_name}..." or "Based on the latest rates..."
- Give a practical example (like converting 100 or 1000 units)

Response:"""

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                            "top_p": 0.9,
                        }
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    friendly_text = result.get("response", "").strip()
                    if friendly_text:
                        return friendly_text

        except Exception:
            pass

        return simple_response

    async def generate_unsupported_currency_response(
        self, query: str, supported_currencies: list
    ) -> str:
        """
        Generate a friendly response for unsupported currency queries

        Args:
            query: The user's original query
            supported_currencies: List of supported currency codes

        Returns:
            Friendly explanation about supported currencies
        """
        # Currency names for better context
        currency_names = {
            "USD": "US Dollar",
            "EUR": "Euro",
            "GBP": "British Pound",
        }

        supported_list = ", ".join([f"{code} ({currency_names.get(code, code)})" for code in supported_currencies])

        fallback_response = f"I couldn't identify a supported currency in your query. Currently, I can help you with exchange rates for: {supported_list}. Try asking something like 'What is the USD to ZAR rate?'"

        try:
            prompt = f"""You are a helpful currency exchange assistant. A user asked: "{query}"

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

Response:"""

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.8,
                            "top_p": 0.9,
                        }
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    friendly_text = result.get("response", "").strip()
                    if friendly_text:
                        return friendly_text

        except Exception:
            pass

        return fallback_response
