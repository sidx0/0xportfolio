"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatUsd } from "@/lib/format";

interface Snapshot {
  totalValueUsd: number;
  createdAt: string;
}

interface ValueChartProps {
  data: Snapshot[];
  loading: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-panel border border-border rounded px-3 py-2">
      <p className="font-mono text-[10px] text-dim mb-1">{label}</p>
      <p className="font-mono text-sm text-white font-bold">
        {formatUsd(payload[0].value)}
      </p>
    </div>
  );
}

export function ValueChart({ data, loading }: ValueChartProps) {
  const chartData = data.map((s) => ({
    date: formatDate(s.createdAt),
    value: s.totalValueUsd,
  }));

  const isEmpty = !loading && chartData.length < 2;

  return (
    <div className="rounded border border-border bg-panel p-5 h-[280px]">
      <p className="font-sans font-semibold text-sm text-white mb-4">
        Portfolio Value (30d)
      </p>
      {loading ? (
        <div className="space-y-2 pt-4">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[180px] gap-2">
          <p className="font-mono text-xs text-muted">
            No historical data yet.
          </p>
          <p className="font-mono text-[10px] text-muted">
            Snapshots are captured daily via cron job.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "JetBrains Mono", fontSize: 10, fill: "#888" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatUsd(v, true)}
              width={64}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C84B31"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#C84B31", stroke: "#000", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
