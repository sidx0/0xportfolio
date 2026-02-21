# 0xPortfolio

A production-grade multi-chain DeFi portfolio dashboard that tracks your holdings across Ethereum and Arbitrum, converts balances to USD, and stores daily snapshots.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Wallet**: wagmi v2 + viem (MetaMask / injected)
- **Charts**: Recharts (PieChart for allocation, LineChart for historical)
- **Backend**: Next.js API Routes, viem public clients via Alchemy
- **Database**: PostgreSQL + Prisma ORM
- **Prices**: CoinGecko API
- **Cron**: node-cron (daily snapshot job)

## Project Structure

```
0xportfolio/
├── app/
│   ├── api/
│   │   ├── portfolio/route.ts     # GET /api/portfolio?address=0x...
│   │   └── snapshot/route.ts     # GET/POST /api/snapshot
│   ├── dashboard/page.tsx         # Main dashboard page
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── AllocationChart.tsx        # Pie chart
│   ├── DashboardContent.tsx       # Data orchestration
│   ├── PortfolioTable.tsx         # Holdings table
│   ├── Providers.tsx              # wagmi + react-query
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── ValueChart.tsx             # Historical line chart
│   └── WalletConnect.tsx
├── cron/
│   └── index.ts                   # Daily snapshot scheduler
├── lib/
│   ├── clients.ts                 # viem public clients
│   ├── coingecko.ts               # Price fetcher
│   ├── format.ts                  # Formatting utilities
│   ├── portfolio.ts               # Core portfolio logic
│   ├── prisma.ts                  # Prisma singleton
│   ├── snapshots.ts               # Snapshot service
│   ├── tokens.ts                  # ERC-20 token configs
│   └── wagmi.ts                   # wagmi config
└── prisma/
    └── schema.prisma
```

## Prerequisites

- Node.js 18+
- PostgreSQL instance
- Alchemy account (free tier works)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/sidx/0xportfolio
cd 0xportfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/0xportfolio"
ALCHEMY_ETHEREUM_RPC="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
ALCHEMY_ARBITRUM_RPC="https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY"
COINGECKO_API_KEY=""          # Optional - leave empty for free tier
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npm run db:generate
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/dashboard`.

### 5. Run the cron job (separate process)

```bash
npm run cron:start
```

The cron job runs every day at 00:00 UTC and saves a portfolio snapshot for every tracked wallet address (any address that has connected to the app).

## API Reference

### `GET /api/portfolio?address=0x...`

Fetches live portfolio data for a wallet address.

**Response:**
```json
{
  "chains": {
    "ethereum": {
      "chainName": "Ethereum",
      "chainId": 1,
      "nativeBalance": "1.234567",
      "nativeSymbol": "ETH",
      "nativeUsdValue": 3456.78,
      "tokens": [...],
      "totalUsdValue": 5678.90
    },
    "arbitrum": { ... }
  },
  "totalValueUsd": 10000.00,
  "fetchedAt": "2024-01-01T00:00:00.000Z"
}
```

### `GET /api/snapshot?address=0x...&days=30`

Returns historical snapshots for charting.

### `POST /api/snapshot`

Manually trigger a snapshot save.

```json
{ "address": "0x..." }
```

## Deployment

### Vercel (Frontend + API)

```bash
npm install -g vercel
vercel
```

Set all env vars in the Vercel dashboard. Note: the cron job must run separately (see below).

### Cron Job Deployment Options

**Option A: Railway / Render worker**
Deploy `cron/index.ts` as a background worker with `npm run cron:start`.

**Option B: Vercel Cron Jobs**
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/snapshot/cron",
    "schedule": "0 0 * * *"
  }]
}
```
Then create `/api/snapshot/cron/route.ts` that calls `saveSnapshot` for all tracked wallets.

**Option C: Self-hosted**
Use PM2 on a VPS:
```bash
pm2 start "npm run cron:start" --name 0xportfolio-cron
```

### Database

Use any PostgreSQL provider:
- [Supabase](https://supabase.com) (free tier available)
- [Neon](https://neon.tech) (free tier available)
- [Railway](https://railway.app)

Run migrations in production:
```bash
npm run db:migrate
```

## Supported Assets

**Ethereum Mainnet:** ETH (native), USDC, USDT, WBTC, DAI, UNI

**Arbitrum One:** ETH (native), USDC.e, USDT, ARB, WBTC

Additional tokens can be added in `lib/tokens.ts`.

## Customization

- Add tokens: Edit `ETHEREUM_TOKENS` / `ARBITRUM_TOKENS` in `lib/tokens.ts`
- Add chains: Add a new client in `lib/clients.ts`, extend the portfolio fetcher
- Theme: Accent color is `#C84B31` — update in `tailwind.config.ts`
