"use client";

import { useQuery } from "@tanstack/react-query";
import type { PortfolioResult } from "@/lib/portfolio";
import { PortfolioTable } from "./PortfolioTable";
import { AllocationChart } from "./AllocationChart";
import { ValueChart } from "./ValueChart";
import { StatCard } from "./StatCard";
import { formatUsd } from "@/lib/format";

async function fetchPortfolio(address: string): Promise<PortfolioResult> {
  const res = await fetch(`/api/portfolio?address=${address}`);
  if (!res.ok) {
    const err = await res.json() as { error: string };
    throw new Error(err.error ?? "Failed to fetch portfolio");
  }
  return res.json() as Promise<PortfolioResult>;
}

async function fetchSnapshots(address: string) {
  const res = await fetch(`/api/snapshot?address=${address}&days=30`);
  if (!res.ok) return { snapshots: [] };
  return res.json() as Promise<{ snapshots: Array<{ totalValueUsd: number; createdAt: string }> }>;
}

interface DashboardContentProps {
  address: string;
}

export function DashboardContent({ address }: DashboardContentProps) {
  const portfolioQuery = useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => fetchPortfolio(address),
    refetchInterval: 60_000,
  });

  const snapshotQuery = useQuery({
    queryKey: ["snapshots", address],
    queryFn: () => fetchSnapshots(address),
  });

  if (portfolioQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
        <div className="font-mono text-accent text-sm">
          Error: {portfolioQuery.error?.message}
        </div>
        <button
          onClick={() => portfolioQuery.refetch()}
          className="font-mono text-xs text-dim border border-border px-4 py-2 rounded hover:border-muted transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const portfolio = portfolioQuery.data;
  const isLoading = portfolioQuery.isLoading;

  const allTokens = portfolio
    ? [
        ...portfolio.chains.ethereum.tokens,
        ...portfolio.chains.arbitrum.tokens,
      ]
    : [];

  const ethValue = portfolio?.chains.ethereum.totalUsdValue ?? 0;
  const arbValue = portfolio?.chains.arbitrum.totalUsdValue ?? 0;

  const allocationData = portfolio
    ? [
        {
          name: "ETH (Ethereum)",
          value: portfolio.chains.ethereum.nativeUsdValue,
          fill: "#C84B31",
        },
        {
          name: "ETH (Arbitrum)",
          value: portfolio.chains.arbitrum.nativeUsdValue,
          fill: "#7C2D12",
        },
        ...allTokens
          .filter((t) => t.usdValue > 0)
          .map((t, i) => ({
            name: t.symbol,
            value: t.usdValue,
            fill: PALETTE[i % PALETTE.length],
          })),
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Value"
          value={isLoading ? null : formatUsd(portfolio?.totalValueUsd ?? 0)}
          accent
          loading={isLoading}
        />
        <StatCard
          label="Ethereum"
          value={isLoading ? null : formatUsd(ethValue)}
          loading={isLoading}
        />
        <StatCard
          label="Arbitrum"
          value={isLoading ? null : formatUsd(arbValue)}
          loading={isLoading}
        />
        <StatCard
          label="Assets"
          value={isLoading ? null : String(allTokens.filter((t) => t.usdValue > 0).length + 2)}
          loading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <AllocationChart data={allocationData} loading={isLoading} />
        </div>
        <div className="col-span-3">
          <ValueChart
            data={snapshotQuery.data?.snapshots ?? []}
            loading={snapshotQuery.isLoading}
          />
        </div>
      </div>

      {/* Portfolio tables */}
      <PortfolioTable
        portfolio={portfolio}
        loading={isLoading}
        onRefresh={() => portfolioQuery.refetch()}
        isRefetching={portfolioQuery.isFetching}
      />
    </div>
  );
}

const PALETTE = [
  "#1D6D8A",
  "#2E8B57",
  "#7B5EA7",
  "#C0873E",
  "#4A7FA5",
  "#8B4513",
  "#2F6B6B",
];
