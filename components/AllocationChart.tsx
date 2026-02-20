"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatUsd } from "@/lib/format";

interface AllocationItem {
  name: string;
  value: number;
  fill: string;
}

interface AllocationChartProps {
  data: AllocationItem[];
  loading: boolean;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-panel border border-border rounded px-3 py-2">
      <p className="font-mono text-xs text-dim mb-1">{item.name}</p>
      <p className="font-mono text-sm text-white font-bold">{formatUsd(item.value)}</p>
    </div>
  );
}

export function AllocationChart({ data, loading }: AllocationChartProps) {
  return (
    <div className="rounded border border-border bg-panel p-5 h-[280px]">
      <p className="font-sans font-semibold text-sm text-white mb-4">Allocation</p>
      {loading ? (
        <div className="flex items-center justify-center h-[180px]">
          <div className="w-32 h-32 rounded-full skeleton" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[180px]">
          <p className="font-mono text-xs text-muted">No data</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="mt-2 grid grid-cols-2 gap-1">
        {data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: item.fill }}
            />
            <span className="font-mono text-[10px] text-dim truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
