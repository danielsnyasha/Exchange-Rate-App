from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime

from app.models.schemas import (
    ExchangeRateRequest,
    DirectLookupResponse,
    NaturalLanguageRequest,
    NaturalLanguageResponse,
    ErrorResponse
)
from app.services.exchange_rate_service import ExchangeRateService
from app.services.llm_service import LLMService
from app.services.currency_data import get_all_currencies

router = APIRouter(prefix="/api/v1/exchange", tags=["exchange"])

# Initialize services
exchange_service = ExchangeRateService()
llm_service = LLMService()


@router.get("/currencies")
async def get_currencies():
    """
    Get all supported currencies

    Returns list of all available currencies with metadata
    """
    return {"currencies": get_all_currencies()}


@router.post("/direct", response_model=DirectLookupResponse)
async def direct_lookup(request: ExchangeRateRequest):
    """
    Direct currency exchange rate lookup

    Get the exchange rate between two currencies
    """
    try:
        rate = await exchange_service.get_rate(
            request.base_currency,
            request.target_currency
        )

        return DirectLookupResponse(
            base_currency=request.base_currency,
            target_currency=request.target_currency,
            rate=rate,
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/nlp", response_model=NaturalLanguageResponse)
async def natural_language_lookup(request: NaturalLanguageRequest):
    """
    Natural language exchange rate lookup

    Process a natural language query to determine currency and get exchange rate
    """
    SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"]

    try:
        # Extract currency from query
        base_currency = await llm_service.extract_currency_from_query(request.query)

        if not base_currency:
            # Generate friendly error message using Ollama
            friendly_message = await llm_service.generate_unsupported_currency_response(
                request.query, SUPPORTED_CURRENCIES
            )

            return JSONResponse(
                status_code=400,
                content={
                    "error": "currency_not_recognized",
                    "message": friendly_message,
                    "supported_currencies": SUPPORTED_CURRENCIES,
                    "examples": [
                        "What is the USD to ZAR rate?",
                        "Convert EUR to ZAR",
                        "How much is the British pound in rands?"
                    ]
                }
            )

        # Get exchange rate
        rate = await exchange_service.get_rate(base_currency, "ZAR")

        # Generate friendly response
        friendly_response = await llm_service.generate_friendly_response(
            base_currency, "ZAR", rate
        )

        return NaturalLanguageResponse(
            base_currency=base_currency,
            target_currency="ZAR",
            target_currency_amount=rate,
            friendly_response=friendly_response,
            timestamp=datetime.utcnow().isoformat()
        )

    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "server_error",
                "message": "An unexpected error occurred while processing your request. Please try again.",
                "supported_currencies": SUPPORTED_CURRENCIES
            }
        )


@router.get("/historical/{base_currency}/{target_currency}")
async def get_historical_rates(base_currency: str, target_currency: str, days: int = 30):
    """
    Get historical exchange rates for a currency pair

    Args:
        base_currency: Base currency code (e.g., USD)
        target_currency: Target currency code (e.g., ZAR)
        days: Number of days of historical data (default: 30)

    Returns historical rate data
    """
    try:
        historical_data = await exchange_service.get_historical_rates(
            base_currency, target_currency, days
        )

        return {
            "base_currency": base_currency,
            "target_currency": target_currency,
            "data": historical_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
