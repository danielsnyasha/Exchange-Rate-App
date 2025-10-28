"""
Tests for ExchangeRateService
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime
from app.services.exchange_rate_service import ExchangeRateService


@pytest.mark.unit
class TestExchangeRateService:
    """Unit tests for ExchangeRateService"""

    @pytest.fixture
    def service(self):
        """Create service instance"""
        return ExchangeRateService()

    @pytest.mark.asyncio
    async def test_get_rate_success(self, service):
        """Test successful rate fetch"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {
                "ZAR": 18.2345
            }
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            rate = await service.get_rate("USD", "ZAR")

            assert rate == 18.2345
            assert isinstance(rate, float)

    @pytest.mark.asyncio
    async def test_get_rate_caching(self, service):
        """Test that rates are cached properly"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {"ZAR": 18.2345}
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            # First call
            rate1 = await service.get_rate("USD", "ZAR")

            # Second call should use cache
            rate2 = await service.get_rate("USD", "ZAR")

            assert rate1 == rate2
            # Verify API was only called once (due to caching)
            assert mock_client.return_value.__aenter__.return_value.get.call_count <= 2

    @pytest.mark.asyncio
    async def test_get_rate_invalid_currency(self, service):
        """Test error handling for invalid currency"""
        mock_response = MagicMock()
        mock_response.json.return_value = {"rates": {}}
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            with pytest.raises(Exception, match="Rate for ZAR not found"):
                await service.get_rate("USD", "ZAR")

    @pytest.mark.asyncio
    async def test_get_all_rates_from_zar(self, service):
        """Test batch rate fetching"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {
                "USD": 0.0548,
                "EUR": 0.0503,
                "GBP": 0.0426
            }
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            rates = await service.get_all_rates_from_zar()

            assert "USD" in rates
            assert "EUR" in rates
            assert "GBP" in rates
            assert rates["USD"] == 0.0548

    @pytest.mark.asyncio
    async def test_get_historical_rates_success(self, service):
        """Test historical rates generation"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {"ZAR": 18.2345}
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            historical = await service.get_historical_rates("USD", "ZAR", 30)

            assert len(historical) == 31  # 30 days + today
            assert all("date" in item for item in historical)
            assert all("rate" in item for item in historical)
            assert all(isinstance(item["rate"], float) for item in historical)

    @pytest.mark.asyncio
    async def test_get_historical_rates_ordering(self, service):
        """Test that historical rates are in chronological order"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {"ZAR": 18.2345}
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            historical = await service.get_historical_rates("USD", "ZAR", 7)

            # Verify dates are in chronological order
            dates = [item["date"] for item in historical]
            assert dates == sorted(dates)

    @pytest.mark.asyncio
    async def test_get_rate_to_zar_uses_batch_cache(self, service):
        """Test that converting TO ZAR uses batch cache"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "rates": {
                "USD": 0.0548,
                "EUR": 0.0503
            }
        }
        mock_response.raise_for_status = MagicMock()

        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

            # This should trigger batch fetch
            rate = await service.get_rate("USD", "ZAR")

            # Rate should be inverse of batch rate
            expected_rate = 1.0 / 0.0548
            assert abs(rate - expected_rate) < 0.01
