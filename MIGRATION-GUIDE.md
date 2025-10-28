# Migration from FastAPI to Next.js with Prisma

This project has been successfully migrated from a FastAPI backend to a full-stack Next.js application with Prisma ORM and MongoDB.

## What Changed

### Backend Architecture
- **Before**: Separate FastAPI backend running on port 8000
- **After**: Next.js API routes integrated within the frontend application
- **Database**: MongoDB Atlas with Prisma ORM
- **No Docker Required**: Application runs directly with npm commands

### Key Changes

1. **API Routes** (All endpoints now in Next.js):
   - `GET /api/v1/exchange/currencies` - Get all supported currencies
   - `POST /api/v1/exchange/direct` - Direct exchange rate lookup
   - `POST /api/v1/exchange/nlp` - Natural language query processing
   - `GET /api/v1/exchange/historical/[base]/[target]?days=30` - Historical rates

2. **Database Models** (MongoDB with Prisma):
   - `QueryLog` - Tracks all API queries for analytics
   - `ExchangeRateCache` - Caches exchange rates to reduce API calls
   - `UserPreference` - Stores user preferences (for future features)

3. **Services Ported**:
   - Exchange Rate Service (`lib/services/exchange-rate-service.ts`)
   - LLM Service (`lib/services/llm-service.ts`)
   - Currency Data (`lib/data/currency-data.ts`)

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
The `.env` file is already configured with:
```env
DATABASE_URL="mongodb+srv://musanhunyasha_db_user:Xc63iEeXr80yrhi7@exchange-rate-voss.izoqyek.mongodb.net/exchange-rate-db?retryWrites=true&w=majority"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
OLLAMA_URL=http://localhost:11434
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Schema to Database (Already Done)
```bash
npm run prisma:push
```

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:push` - Push schema changes to database

## Deployment to Vercel

This application is now ready for Vercel deployment:

1. **Push to GitHub** (if not already done)
2. **Import to Vercel**:
   - Go to vercel.com
   - Import your repository
   - Add environment variables from `.env`
3. **Environment Variables** (Add to Vercel):
   ```
   DATABASE_URL=mongodb+srv://musanhunyasha_db_user:Xc63iEeXr80yrhi7@exchange-rate-voss.izoqyek.mongodb.net/exchange-rate-db?retryWrites=true&w=majority
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   OLLAMA_URL=http://localhost:11434
   ```
4. **Deploy** - Vercel will automatically build and deploy

## Key Features

### Database Caching
- Exchange rates are cached in MongoDB for 10 minutes
- Reduces API calls to external rate providers
- Faster response times

### Query Logging
- All queries (successful and failed) are logged to MongoDB
- Useful for analytics and debugging
- Track which currencies users query most

### LLM Integration
- Ollama integration for natural language processing
- Falls back to pattern matching if LLM unavailable
- Generates friendly, conversational responses

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── exchange/
│   │           ├── currencies/route.ts
│   │           ├── direct/route.ts
│   │           ├── nlp/route.ts
│   │           └── historical/[base]/[target]/route.ts
│   ├── page.tsx
│   └── dashboard/page.tsx
├── lib/
│   ├── prisma.ts
│   ├── data/
│   │   └── currency-data.ts
│   └── services/
│       ├── exchange-rate-service.ts
│       └── llm-service.ts
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

## API Compatibility

The API endpoints maintain the same structure as the FastAPI backend, so frontend components should work without modification. Request and response formats are identical.

## Notes

- **No Docker Required**: The application runs with standard npm commands
- **MongoDB Atlas**: Already configured and schema pushed
- **Vercel Ready**: Optimized for Vercel deployment
- **Type Safety**: Full TypeScript support with Prisma
- **Edge Compatible**: Next.js API routes work on Vercel Edge

## Old Backend

The old FastAPI backend in the `backend/` directory is no longer needed and can be archived or removed.
