export function formatUsd(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (compact && value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatBalance(value: string, decimals = 6): string {
  const num = parseFloat(value);
  if (num === 0) return "0.000000";
  if (num < 0.000001) return "<0.000001";
  return num.toFixed(Math.min(decimals, 8));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
