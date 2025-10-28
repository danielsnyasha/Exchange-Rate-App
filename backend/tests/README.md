# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Exchange Rate API backend application.

## Test Structure

```
tests/
├── conftest.py                    # Shared fixtures and configuration
├── test_exchange_rate_service.py  # Exchange rate service tests
├── test_llm_service.py            # LLM service tests
├── test_api_endpoints.py          # API endpoint integration tests
└── test_schemas.py                # Pydantic schema validation tests
```

## Running Tests

### Run All Tests
```bash
cd backend
pytest
```

### Run with Coverage
```bash
pytest --cov=app --cov-report=html
```

### Run Specific Test File
```bash
pytest tests/test_api_endpoints.py
```

### Run Tests by Marker
```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run only slow tests
pytest -m slow
```

### Run Specific Test
```bash
pytest tests/test_api_endpoints.py::TestDirectLookupEndpoint::test_direct_lookup_success
```

### Run with Verbose Output
```bash
pytest -v
```

## Test Coverage

The test suite covers:

- **Exchange Rate Service** (8 tests)
  - Rate fetching and caching
  - Batch rate retrieval
  - Historical data generation
  - Error handling

- **LLM Service** (4 tests)
  - Currency extraction from natural language
  - Friendly response generation
  - Unsupported currency handling
  - Fallback mechanisms

- **API Endpoints** (6 tests)
  - Direct lookup endpoint
  - Natural language lookup endpoint
  - Health check endpoint
  - Error responses

- **Schemas** (7 tests)
  - Pydantic model validation
  - Required fields
  - Default values
  - Error handling

## Test Markers

- `@pytest.mark.unit` - Unit tests (fast, isolated)
- `@pytest.mark.integration` - Integration tests (may hit real services)
- `@pytest.mark.slow` - Slow running tests

## Mocking Strategy

Tests use mocking to:
- Avoid hitting external APIs (openrates.io, Ollama)
- Ensure fast test execution
- Make tests deterministic
- Isolate components

## Coverage Goals

- Minimum 80% code coverage
- All critical paths tested
- Error scenarios covered
- Edge cases handled

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
```bash
pytest --cov=app --cov-report=xml --cov-fail-under=80
```
