"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortenAddress } from "@/lib/format";

interface WalletConnectProps {
  primary?: boolean;
}

export function WalletConnect({ primary = false }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-panel">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono text-xs text-white">{shortenAddress(address)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="font-mono text-xs text-dim hover:text-white border border-border px-3 py-1.5 rounded transition-colors hover:border-muted"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className={
        primary
          ? "font-sans font-semibold text-sm px-6 py-2.5 rounded bg-accent text-white hover:bg-accent-dim transition-colors disabled:opacity-50"
          : "font-sans font-medium text-sm px-4 py-2 rounded border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
      }
    >
      {isPending ? "Connecting..." : "Connect MetaMask"}
    </button>
  );
}
