"use client";

import type { PortfolioResult, TokenBalance } from "@/lib/portfolio";
import { formatUsd, formatBalance } from "@/lib/format";

interface PortfolioTableProps {
  portfolio?: PortfolioResult;
  loading: boolean;
  onRefresh: () => void;
  isRefetching: boolean;
}

type TableRow = {
  chain: string;
  symbol: string;
  balance: string;
  usdValue: number;
  address: string;
};

function chainRows(
  chainName: string,
  nativeSymbol: string,
  nativeBalance: string,
  nativeUsdValue: number,
  tokens: TokenBalance[]
): TableRow[] {
  const rows: TableRow[] = [
    {
      chain: chainName,
      symbol: nativeSymbol,
      balance: nativeBalance,
      usdValue: nativeUsdValue,
      address: "native",
    },
  ];

  for (const t of tokens) {
    if (parseFloat(t.balance) === 0) continue;
    rows.push({
      chain: chainName,
      symbol: t.symbol,
      balance: t.balance,
      usdValue: t.usdValue,
      address: t.address,
    });
  }

  return rows;
}

const SKELETON_ROWS = Array.from({ length: 6 }, (_, i) => i);

export function PortfolioTable({ portfolio, loading, onRefresh, isRefetching }: PortfolioTableProps) {
  const rows: TableRow[] = portfolio
    ? [
        ...chainRows(
          "Ethereum",
          portfolio.chains.ethereum.nativeSymbol,
          portfolio.chains.ethereum.nativeBalance,
          portfolio.chains.ethereum.nativeUsdValue,
          portfolio.chains.ethereum.tokens
        ),
        ...chainRows(
          "Arbitrum",
          portfolio.chains.arbitrum.nativeSymbol,
          portfolio.chains.arbitrum.nativeBalance,
          portfolio.chains.arbitrum.nativeUsdValue,
          portfolio.chains.arbitrum.tokens
        ),
      ].sort((a, b) => b.usdValue - a.usdValue)
    : [];

  const total = portfolio?.totalValueUsd ?? 0;

  return (
    <div className="rounded border border-border bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="font-sans font-semibold text-sm text-white">Holdings</p>
        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="flex items-center gap-1.5 font-mono text-[11px] text-dim hover:text-white transition-colors disabled:opacity-40"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className={isRefetching ? "animate-spin" : ""}
          >
            <path
              d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C14.39 3 16.57 3.93 18.18 5.44"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M21 3V8H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-2.5 font-mono text-[10px] text-muted uppercase tracking-widest">
              Asset
            </th>
            <th className="text-left px-5 py-2.5 font-mono text-[10px] text-muted uppercase tracking-widest">
              Chain
            </th>
            <th className="text-right px-5 py-2.5 font-mono text-[10px] text-muted uppercase tracking-widest">
              Balance
            </th>
            <th className="text-right px-5 py-2.5 font-mono text-[10px] text-muted uppercase tracking-widest">
              USD Value
            </th>
            <th className="text-right px-5 py-2.5 font-mono text-[10px] text-muted uppercase tracking-widest">
              Allocation
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? SKELETON_ROWS.map((i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-5 py-3.5">
                    <div className="skeleton h-4 w-12" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="skeleton h-4 w-20" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="skeleton h-4 w-24 ml-auto" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="skeleton h-4 w-20 ml-auto" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="skeleton h-4 w-12 ml-auto" />
                  </td>
                </tr>
              ))
            : rows.map((row, i) => {
                const pct = total > 0 ? (row.usdValue / total) * 100 : 0;
                return (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-black/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center">
                          <span className="font-mono text-[9px] text-dim">
                            {row.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-white">{row.symbol}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded border ${
                          row.chain === "Ethereum"
                            ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
                            : "text-orange-400 border-orange-400/20 bg-orange-400/5"
                        }`}
                      >
                        {row.chain}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-white">
                      {formatBalance(row.balance)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-sm text-white">
                      {formatUsd(row.usdValue)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-dim w-10 text-right">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>

      {!loading && rows.length === 0 && (
        <div className="text-center py-12">
          <p className="font-mono text-sm text-muted">No assets found for this address.</p>
        </div>
      )}
    </div>
  );
}
