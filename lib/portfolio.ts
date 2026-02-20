import { formatUnits, isAddress } from "viem";
import type { PublicClient } from "viem";
import { ethereumClient, arbitrumClient } from "./clients";
import { ERC20_ABI, ETHEREUM_TOKENS, ARBITRUM_TOKENS, type TokenConfig } from "./tokens";
import { fetchPrices } from "./coingecko";

export type TokenBalance = {
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: string;
  decimals: number;
  usdValue: number;
  coinGeckoId: string;
  address: string | "native";
};

export type ChainPortfolio = {
  chainName: string;
  chainId: number;
  nativeBalance: string;
  nativeSymbol: string;
  nativeUsdValue: number;
  tokens: TokenBalance[];
  totalUsdValue: number;
};

export type PortfolioResult = {
  chains: {
    ethereum: ChainPortfolio;
    arbitrum: ChainPortfolio;
  };
  totalValueUsd: number;
  fetchedAt: string;
};

async function fetchNativeBalance(
  client: PublicClient,
  address: `0x${string}`
): Promise<bigint> {
  return client.getBalance({ address });
}

async function fetchERC20Balance(
  client: PublicClient,
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
): Promise<bigint> {
  try {
    return await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [walletAddress],
    });
  } catch {
    return 0n;
  }
}

async function buildChainPortfolio(
  client: PublicClient,
  walletAddress: `0x${string}`,
  chainId: number,
  chainName: string,
  nativeSymbol: string,
  nativeCoinId: string,
  tokens: TokenConfig[],
  prices: Record<string, number>
): Promise<ChainPortfolio> {
  const nativeRaw = await fetchNativeBalance(client, walletAddress);
  const nativeBalance = formatUnits(nativeRaw, 18);
  const nativeUsdValue = parseFloat(nativeBalance) * (prices[nativeCoinId] ?? 0);

  const tokenBalances: TokenBalance[] = await Promise.all(
    tokens.map(async (token) => {
      const raw = await fetchERC20Balance(client, token.address, walletAddress);
      const balance = formatUnits(raw, token.decimals);
      const usdValue = parseFloat(balance) * (prices[token.coinGeckoId] ?? 0);

      return {
        symbol: token.symbol,
        name: token.symbol,
        balance,
        balanceRaw: raw.toString(),
        decimals: token.decimals,
        usdValue,
        coinGeckoId: token.coinGeckoId,
        address: token.address,
      };
    })
  );

  const relevantTokens = tokenBalances.filter((t) => parseFloat(t.balance) > 0);

  const totalUsdValue =
    nativeUsdValue + relevantTokens.reduce((sum, t) => sum + t.usdValue, 0);

  return {
    chainName,
    chainId,
    nativeBalance,
    nativeSymbol,
    nativeUsdValue,
    tokens: relevantTokens,
    totalUsdValue,
  };
}

export async function fetchPortfolio(walletAddress: string): Promise<PortfolioResult> {
  if (!isAddress(walletAddress)) {
    throw new Error("Invalid wallet address");
  }

  const address = walletAddress as `0x${string}`;

  const allCoinIds = [
    "ethereum",
    ...ETHEREUM_TOKENS.map((t) => t.coinGeckoId),
    ...ARBITRUM_TOKENS.map((t) => t.coinGeckoId),
  ];

  const prices = await fetchPrices(allCoinIds);

  const [ethereumPortfolio, arbitrumPortfolio] = await Promise.all([
    buildChainPortfolio(
      ethereumClient,
      address,
      1,
      "Ethereum",
      "ETH",
      "ethereum",
      ETHEREUM_TOKENS,
      prices
    ),
    buildChainPortfolio(
      arbitrumClient,
      address,
      42161,
      "Arbitrum",
      "ETH",
      "ethereum",
      ARBITRUM_TOKENS,
      prices
    ),
  ]);

  const totalValueUsd = ethereumPortfolio.totalUsdValue + arbitrumPortfolio.totalUsdValue;

  return {
    chains: {
      ethereum: ethereumPortfolio,
      arbitrum: arbitrumPortfolio,
    },
    totalValueUsd,
    fetchedAt: new Date().toISOString(),
  };
}
