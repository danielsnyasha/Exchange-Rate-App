"""
Pytest configuration and shared fixtures
"""
import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Synchronous test client for FastAPI"""
    return TestClient(app)


@pytest.fixture
async def async_client():
    """Async test client for FastAPI"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
def mock_exchange_rate():
    """Mock exchange rate data"""
    return {
        "USD": 18.2345,
        "EUR": 19.8765,
        "GBP": 23.4567
    }


@pytest.fixture
def sample_query_usd():
    """Sample natural language query for USD"""
    return "What is the USD to ZAR rate?"


@pytest.fixture
def sample_query_unsupported():
    """Sample natural language query for unsupported currency"""
    return "What is the Japanese yen rate?"
