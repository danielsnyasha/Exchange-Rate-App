# Claude Code - Quick Reference Guide

This document contains essential information for continuing work on this project after a PC restart or conversation reset.

## Project Overview

This is a **ZAR Exchange Hub** - a currency exchange rate application built for the VOSS Solutions technical assessment. It provides real-time exchange rates for South African Rand (ZAR) against USD, EUR, and GBP with AI-powered natural language queries.

## What Has Been Completed

### ✅ Backend
- FastAPI backend with async endpoints
- Integration with openrates.io API for exchange rates
- Ollama + llama3:8b integration for natural language processing
- Enhanced AI responses that are conversational and contextual
- Smart error handling (e.g., unsupported currencies get friendly AI explanations)
- Comprehensive test suite (24 tests, 74% coverage)
- Docker configuration ready

### ✅ Frontend
- Next.js 15 + React 19 with TypeScript
- Fully responsive design (mobile-first)
- Interactive charts with currency selection:
  - Trading Activity (Weekly Fluctuation)
  - Volatility Area Chart
  - Market Distribution (Relative Currency Strength)
- Beautiful time range selector (1D/1W/1M/3M/1Y/5Y/10Y)
- Direct lookup and natural language query interfaces
- Docker configuration with standalone build

### ✅ Testing
- 24 automated tests covering:
  - Exchange Rate Service (7 tests)
  - API Endpoints (6 tests)
  - LLM Service (4 tests)
  - Pydantic Schemas (7 tests)
- 74% code coverage
- All tests passing

### ⏳ In Progress
- Docker deployment testing (containers ready, need to verify they work)

## Quick Start Commands

### Running Locally (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload  # Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev                    # Runs on http://localhost:3000
```

**Ollama (Required for AI features):**
```bash
ollama list                    # Check if llama3:8b is installed
ollama pull llama3:8b         # If not installed
ollama serve                   # Usually auto-starts on Windows/Mac
```

### Running With Docker (Recommended)

**Prerequisites:**
1. Docker Desktop must be running (check system tray for whale icon)
2. Ollama must be running on host machine with llama3:8b model

**Commands:**
```bash
# Build and start all services
docker-compose up --build

# Run in background (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Running Tests

```bash
cd backend
pytest                              # Run all tests
pytest --cov=app --cov-report=html  # With coverage report
pytest -v                           # Verbose output
```

## Docker Path Issue on Windows

If `docker` command is not found in Git Bash, use:
```bash
export PATH="/c/Program Files/Docker/Docker/resources/bin:$PATH"
docker --version
```

Or use PowerShell:
```powershell
docker --version
docker-compose up --build
```

## Important Files & Locations

### Configuration Files
- `docker-compose.yml` - Orchestrates backend and frontend containers
- `backend/Dockerfile` - Backend container configuration
- `frontend/Dockerfile` - Frontend multi-stage build
- `backend/requirements.txt` - Python dependencies
- `frontend/package.json` - Node.js dependencies
- `backend/pytest.ini` - Test configuration

### Key Backend Files
- `backend/app/main.py` - FastAPI application entry point
- `backend/app/api/routes/exchange.py` - API endpoints
- `backend/app/services/llm_service.py` - Ollama integration
- `backend/app/services/exchange_rate_service.py` - Exchange rate logic
- `backend/app/models/schemas.py` - Pydantic models
- `backend/conftest.py` - Test fixtures
- `backend/tests/` - All test files

### Key Frontend Files
- `frontend/app/page.tsx` - Home page
- `frontend/app/dashboard/page.tsx` - Main dashboard
- `frontend/components/time-range-selector.tsx` - Beautiful time selector
- `frontend/components/simple-currency-selector.tsx` - Currency picker
- `frontend/components/direct-lookup.tsx` - Direct rate lookup
- `frontend/components/natural-language-lookup.tsx` - AI-powered queries
- `frontend/components/charts/` - All chart components
- `frontend/lib/api-client.ts` - Backend API client

## Known Issues & Solutions

### Docker Desktop Not Running
**Error:** `unable to get image... The system cannot find the file specified`
**Solution:** Start Docker Desktop from Start Menu, wait for whale icon in system tray

### Ollama Connection Refused
**Error:** `Connection refused to localhost:11434`
**Solution:**
```bash
ollama serve        # Start Ollama
ollama list         # Verify llama3:8b is installed
ollama pull llama3:8b  # If model missing
```

### Docker Can't Access Ollama
**Solution:** The docker-compose.yml already has this configured:
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

### Unsupported Currency Queries
The app only supports USD, EUR, GBP against ZAR. Queries for other currencies (like yen) get friendly AI-powered error messages explaining what currencies are supported.

## Project Requirements (from PDF)

- [x] Dockerized deployment
- [x] Ollama with llama3:8b model
- [x] FastAPI backend
- [x] Next.js frontend
- [x] Exchange rate API integration (openrates.io)
- [x] Natural language query processing
- [x] Historical data visualization
- [x] Responsive design
- [x] Automated testing

## Next Steps (When You Return)

1. **Start Docker Desktop** (if not running)
2. **Verify Ollama is running:**
   ```bash
   ollama list
   ```
3. **Test Docker deployment:**
   ```bash
   docker-compose up --build
   ```
4. **Verify everything works:**
   - Backend health: http://localhost:8000/health
   - Frontend loads: http://localhost:3000
   - Try direct lookup
   - Try natural language query
   - Check all charts work
   - Test mobile responsiveness

## Useful Commands

```bash
# Check what's running
docker ps

# View container logs
docker-compose logs backend
docker-compose logs frontend

# Restart a service
docker-compose restart backend

# Clean rebuild
docker-compose down
docker-compose up --build

# Run tests locally
cd backend && pytest -v

# Check Ollama models
ollama list

# Test backend API directly
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/exchange/supported-currencies

# Check ports in use
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

## Tech Stack Summary

**Backend:** Python 3.11, FastAPI, Uvicorn, Ollama, httpx, pytest
**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Recharts, TanStack Query
**Deployment:** Docker, Docker Compose
**AI:** Ollama with llama3:8b model

## Contact & Support

This project is for VOSS Solutions technical assessment. All features requested have been implemented:
- ✅ Improved time range selector UI
- ✅ Added currency selection to charts
- ✅ Fixed responsiveness issues
- ✅ Enhanced AI responses
- ✅ Better error handling
- ✅ Comprehensive test suite
- ⏳ Docker deployment (ready, needs testing)

---

**Last Updated:** 2025-10-28
**Status:** Docker deployment ready for testing. All other features complete and working.
