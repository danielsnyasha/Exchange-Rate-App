"""
Tests for LLMService
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.llm_service import LLMService


@pytest.mark.unit
class TestLLMService:
    """Unit tests for LLMService"""

    @pytest.fixture
    def service(self):
        """Create service instance"""
        return LLMService(ollama_url="http://localhost:11434")

    @pytest.mark.asyncio
    async def test_extract_currency_usd_keyword(self, service):
        """Test currency extraction with USD keyword"""
        result = await service.extract_currency_from_query("What is the USD rate?")
        assert result == "USD"

    @pytest.mark.asyncio
    async def test_extract_currency_euro_keyword(self, service):
        """Test currency extraction with euro keyword"""
        result = await service.extract_currency_from_query("What's the euro rate?")
        assert result == "EUR"

    @pytest.mark.asyncio
    async def test_extract_currency_pound_keyword(self, service):
        """Test currency extraction with pound keyword"""
        result = await service.extract_currency_from_query("British pound to rands")
        assert result == "GBP"

    @pytest.mark.asyncio
    async def test_extract_currency_unsupported(self, service):
        """Test currency extraction with unsupported currency"""
        result = await service.extract_currency_from_query("What is the yen rate?")
        assert result is None
