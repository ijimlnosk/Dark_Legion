export const Stat = ({ v, label }: { v: number; label: string }) => (
  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-2">
    <div className="text-xs font-semibold text-zinc-200">{label}</div>
    <div className="text-[11px] text-zinc-400">{v}</div>
  </div>
);
