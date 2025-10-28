"""
Tests for API endpoints
"""
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


@pytest.mark.integration
class TestDirectLookupEndpoint:
    """Integration tests for direct lookup endpoint"""

    def test_direct_lookup_success(self):
        """Test successful direct lookup"""
        with patch('app.services.exchange_rate_service.ExchangeRateService.get_rate') as mock_get_rate:
            mock_get_rate.return_value = 18.2345

            response = client.post(
                "/api/v1/exchange/direct",
                json={"base_currency": "USD", "target_currency": "ZAR"}
            )

            assert response.status_code == 200
            data = response.json()
            assert data["base_currency"] == "USD"
            assert data["target_currency"] == "ZAR"
            assert "rate" in data
            assert "timestamp" in data

    def test_direct_lookup_invalid_data(self):
        """Test direct lookup with invalid data"""
        response = client.post(
            "/api/v1/exchange/direct",
            json={}
        )

        assert response.status_code == 422  # Validation error


@pytest.mark.integration
class TestNaturalLanguageLookupEndpoint:
    """Integration tests for natural language lookup endpoint"""

    def test_nlp_lookup_success(self):
        """Test successful natural language lookup"""
        with patch('app.services.exchange_rate_service.ExchangeRateService.get_rate') as mock_get_rate, \
             patch('app.services.llm_service.LLMService.extract_currency_from_query') as mock_extract, \
             patch('app.services.llm_service.LLMService.generate_friendly_response') as mock_friendly:

            mock_extract.return_value = "USD"
            mock_get_rate.return_value = 18.2345
            mock_friendly.return_value = "One US Dollar gets you 18.23 South African Rand"

            response = client.post(
                "/api/v1/exchange/nlp",
                json={"query": "What is the USD to ZAR rate?"}
            )

            assert response.status_code == 200
            data = response.json()
            assert data["base_currency"] == "USD"
            assert data["target_currency"] == "ZAR"
            assert "target_currency_amount" in data
            assert "friendly_response" in data
            assert "timestamp" in data

    def test_nlp_lookup_unsupported_currency(self):
        """Test natural language lookup with unsupported currency"""
        with patch('app.services.llm_service.LLMService.extract_currency_from_query') as mock_extract, \
             patch('app.services.llm_service.LLMService.generate_unsupported_currency_response') as mock_unsupported:

            mock_extract.return_value = None
            mock_unsupported.return_value = "I can only help with USD, EUR, and GBP"

            response = client.post(
                "/api/v1/exchange/nlp",
                json={"query": "What is the yen rate?"}
            )

            assert response.status_code == 400
            data = response.json()
            assert "error" in data
            assert "message" in data
            assert "supported_currencies" in data


@pytest.mark.integration
class TestHealthEndpoint:
    """Integration tests for health check endpoint"""

    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


@pytest.mark.integration
class TestRootEndpoint:
    """Integration tests for root endpoint"""

    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "docs" in data
