from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import exchange

app = FastAPI(
    title="ZAR Exchange Hub API",
    description="Currency exchange rate API with AI-powered natural language queries",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:3004",
        "http://localhost:3005"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(exchange.router)


@app.get("/")
async def root():
    return {
        "message": "ZAR Exchange Hub API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
