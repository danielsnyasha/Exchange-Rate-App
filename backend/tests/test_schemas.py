"""
Tests for Pydantic schemas
"""
import pytest
from pydantic import ValidationError
from app.models.schemas import (
    ExchangeRateRequest,
    DirectLookupResponse,
    NaturalLanguageRequest,
    NaturalLanguageResponse,
    ErrorResponse
)


@pytest.mark.unit
class TestSchemas:
    """Unit tests for Pydantic schemas"""

    def test_exchange_rate_request_valid(self):
        """Test valid ExchangeRateRequest"""
        request = ExchangeRateRequest(
            base_currency="USD",
            target_currency="ZAR"
        )
        assert request.base_currency == "USD"
        assert request.target_currency == "ZAR"

    def test_exchange_rate_request_default_target(self):
        """Test ExchangeRateRequest with default target currency"""
        request = ExchangeRateRequest(base_currency="USD")
        assert request.target_currency == "ZAR"

    def test_direct_lookup_response_valid(self):
        """Test valid DirectLookupResponse"""
        response = DirectLookupResponse(
            base_currency="USD",
            target_currency="ZAR",
            rate=18.2345,
            timestamp="2025-10-28T12:00:00"
        )
        assert response.rate == 18.2345

    def test_natural_language_request_valid(self):
        """Test valid NaturalLanguageRequest"""
        request = NaturalLanguageRequest(query="What is the USD rate?")
        assert request.query == "What is the USD rate?"

    def test_natural_language_request_empty_fails(self):
        """Test that empty query fails validation"""
        with pytest.raises(ValidationError):
            NaturalLanguageRequest(query="")

    def test_natural_language_response_valid(self):
        """Test valid NaturalLanguageResponse"""
        response = NaturalLanguageResponse(
            base_currency="USD",
            target_currency="ZAR",
            target_currency_amount=18.2345,
            friendly_response="One dollar gets you 18.23 rand",
            timestamp="2025-10-28T12:00:00"
        )
        assert response.target_currency_amount == 18.2345

    def test_error_response_valid(self):
        """Test valid ErrorResponse"""
        error = ErrorResponse(
            error="currency_not_recognized",
            message="Currency not supported",
            supported_currencies=["USD", "EUR", "GBP"],
            examples=["What is the USD rate?"]
        )
        assert len(error.supported_currencies) == 3
