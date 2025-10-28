from pydantic import BaseModel, Field
from typing import Literal, List, Optional
from datetime import datetime


class ExchangeRateRequest(BaseModel):
    base_currency: str
    target_currency: str = "ZAR"


class DirectLookupResponse(BaseModel):
    base_currency: str
    target_currency: str
    rate: float
    timestamp: str


class NaturalLanguageRequest(BaseModel):
    query: str = Field(..., min_length=1)


class NaturalLanguageResponse(BaseModel):
    base_currency: str
    target_currency: str
    target_currency_amount: float
    friendly_response: str
    timestamp: str


class ErrorResponse(BaseModel):
    error: str
    message: str
    supported_currencies: Optional[List[str]] = None
    examples: Optional[List[str]] = None
