"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Portfolio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-black border-r border-border flex flex-col z-20">
      <div className="px-6 py-5 border-b border-border">
        <span className="font-sans font-extrabold text-lg tracking-tighter">
          <span className="text-accent">0x</span>Portfolio
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase px-3 mb-3">
          Main
        </p>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded font-sans text-sm transition-colors mb-1 ${
                active
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-dim hover:text-white hover:bg-panel"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border">
        <p className="font-mono text-[10px] text-muted">
          Ethereum · Arbitrum
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dim" />
          <span className="font-mono text-[10px] text-dim">Live</span>
        </div>
      </div>
    </aside>
  );
}
