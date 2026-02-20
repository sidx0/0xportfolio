"use client";

import { useAccount } from "wagmi";
import { Sidebar } from "@/components/Sidebar";
import { WalletConnect } from "@/components/WalletConnect";
import { DashboardContent } from "@/components/DashboardContent";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-[220px]">
        <header className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-black z-10">
          <div>
            <h1 className="font-sans font-bold text-xl tracking-tight text-white">
              Portfolio
            </h1>
            {isConnected && address && (
              <p className="font-mono text-xs text-dim mt-0.5">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </div>
          <WalletConnect />
        </header>

        <div className="flex-1 p-8">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#444"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12H16M12 8V16"
                    stroke="#C84B31"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-sans text-lg font-semibold text-white mb-2">
                  Connect your wallet
                </p>
                <p className="font-mono text-sm text-dim max-w-xs">
                  Connect MetaMask to view your multi-chain DeFi portfolio across Ethereum and Arbitrum.
                </p>
              </div>
              <WalletConnect primary />
            </div>
          ) : (
            <DashboardContent address={address!} />
          )}
        </div>
      </main>
    </div>
  );
}
