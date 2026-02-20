import { createPublicClient, http } from "viem";
import { mainnet, arbitrum } from "viem/chains";

if (!process.env.ALCHEMY_ETHEREUM_RPC) {
  throw new Error("ALCHEMY_ETHEREUM_RPC is not defined");
}
if (!process.env.ALCHEMY_ARBITRUM_RPC) {
  throw new Error("ALCHEMY_ARBITRUM_RPC is not defined");
}

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_ETHEREUM_RPC),
});

export const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.ALCHEMY_ARBITRUM_RPC),
});

export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    client: ethereumClient,
    nativeSymbol: "ETH",
    nativeCoinId: "ethereum",
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    client: arbitrumClient,
    nativeSymbol: "ETH",
    nativeCoinId: "ethereum",
  },
} as const;

export type ChainKey = keyof typeof SUPPORTED_CHAINS;
