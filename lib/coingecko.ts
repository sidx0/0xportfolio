const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function fetchPrices(coinIds: string[]): Promise<Record<string, number>> {
  if (coinIds.length === 0) return {};

  const unique = [...new Set(coinIds)];
  const ids = unique.join(",");

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }

  const url = `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd`;

  const res = await fetch(url, { headers, next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Record<string, { usd: number }>;

  return Object.fromEntries(
    Object.entries(data).map(([id, val]) => [id, val.usd])
  );
}
