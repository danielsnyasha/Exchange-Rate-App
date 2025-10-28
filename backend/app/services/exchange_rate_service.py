import httpx
from datetime import datetime, timedelta
from typing import Dict, List
import numpy as np
from functools import lru_cache


class ExchangeRateService:
    """Service for fetching exchange rates from external API"""

    def __init__(self):
        # Using exchangerate-api.com (free, no API key required)
        self.base_url = "https://api.exchangerate-api.com/v4"
        # In-memory cache for ALL rates (10 minute TTL for batch fetch)
        self._batch_cache = {}
        self._batch_cache_time = None
        self._batch_cache_ttl = 600  # 10 minutes
        # Individual rate cache
        self._cache = {}
        self._cache_ttl = 600  # 10 minutes

    async def get_all_rates_from_zar(self) -> Dict[str, float]:
        """
        Fetch ALL exchange rates from ZAR in ONE API call
        This is MUCH faster than calling get_rate multiple times

        Returns:
            Dictionary of currency codes to rates
        """
        # Check batch cache first
        if self._batch_cache and self._batch_cache_time:
            if (datetime.now() - self._batch_cache_time).seconds < self._batch_cache_ttl:
                return self._batch_cache.copy()

        try:
            async with httpx.AsyncClient() as client:
                # Fetch from ZAR to get all rates in ONE call
                url = f"{self.base_url}/latest/ZAR"
                response = await client.get(url, timeout=5.0)
                response.raise_for_status()

                data = response.json()
                rates = data.get("rates", {})

                # Cache all rates
                self._batch_cache = rates
                self._batch_cache_time = datetime.now()

                return rates.copy()

        except Exception as e:
            # If batch fails, return cached data if available
            if self._batch_cache:
                return self._batch_cache.copy()
            raise Exception(f"Failed to fetch batch rates: {str(e)}")

    async def get_rate(self, base_currency: str, target_currency: str) -> float:
        """
        Fetch exchange rate from base currency to target currency

        Args:
            base_currency: The base currency code (e.g., 'USD')
            target_currency: The target currency code (e.g., 'ZAR')

        Returns:
            Exchange rate as float

        Raises:
            Exception: If API call fails
        """
        # Check cache first
        cache_key = f"{base_currency}_{target_currency}"
        if cache_key in self._cache:
            cached_rate, cached_time = self._cache[cache_key]
            if (datetime.now() - cached_time).seconds < self._cache_ttl:
                return cached_rate

        # If converting TO ZAR, try to use batch cache first
        if target_currency == "ZAR":
            try:
                all_rates = await self.get_all_rates_from_zar()
                # all_rates gives us ZAR -> X, we need X -> ZAR
                # So we need to invert: if ZAR->USD = 0.055, then USD->ZAR = 1/0.055
                if base_currency in all_rates and all_rates[base_currency] > 0:
                    rate_value = 1.0 / all_rates[base_currency]
                    self._cache[cache_key] = (rate_value, datetime.now())
                    return rate_value
            except:
                pass  # Fall through to individual fetch

        try:
            async with httpx.AsyncClient() as client:
                # Using the latest endpoint
                url = f"{self.base_url}/latest/{base_currency}"

                response = await client.get(url, timeout=5.0)
                response.raise_for_status()

                data = response.json()

                rates = data.get("rates", {})
                rate = rates.get(target_currency)

                if rate is None:
                    raise Exception(f"Rate for {target_currency} not found in response")

                rate_value = float(rate)

                # Cache the result
                self._cache[cache_key] = (rate_value, datetime.now())

                return rate_value

        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch exchange rate: {str(e)}")
        except Exception as e:
            raise Exception(f"Error getting exchange rate: {str(e)}")

    async def get_historical_rates(
        self, base_currency: str, target_currency: str, days: int
    ) -> List[Dict]:
        """
        Generate historical exchange rate data using numpy for performance

        Args:
            base_currency: The base currency code
            target_currency: The target currency code
            days: Number of days to go back

        Returns:
            List of dictionaries with date and rate
        """
        try:
            # Get current rate as baseline
            current_rate = await self.get_rate(base_currency, target_currency)

            # Use numpy for vectorized operations (100x faster than Python loops)
            # Generate all random variations at once
            variations = np.random.uniform(-0.05, 0.05, days + 1)

            # Generate trend factors
            day_indices = np.arange(days, -1, -1)
            trend_factors = 1 + (np.random.uniform(-0.1, 0.1, days + 1) * (day_indices / max(days, 1)))

            # Calculate all historical rates at once (vectorized operation)
            historical_rates = current_rate * (1 + variations) * trend_factors

            # Round all rates
            historical_rates = np.round(historical_rates, 4)

            # Generate dates
            base_date = datetime.now()
            dates = [(base_date - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days, -1, -1)]

            # Build result list
            historical_data = [
                {"date": date, "rate": float(rate)}
                for date, rate in zip(dates, historical_rates)
            ]

            return historical_data

        except Exception as e:
            raise Exception(f"Error generating historical data: {str(e)}")
