interface StatCardProps {
  label: string;
  value: string | null;
  accent?: boolean;
  loading?: boolean;
}

export function StatCard({ label, value, accent = false, loading = false }: StatCardProps) {
  return (
    <div
      className={`p-4 rounded border ${
        accent ? "border-accent/30 bg-accent/5" : "border-border bg-panel"
      }`}
    >
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">{label}</p>
      {loading || value === null ? (
        <div className="skeleton h-7 w-32" />
      ) : (
        <p
          className={`font-mono font-bold text-xl ${
            accent ? "text-accent accent-glow" : "text-white"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
