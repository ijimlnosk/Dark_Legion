type BarProps = {
  label: string;
  value: number;
  max: number;
  className?: string;
  subtle?: boolean;
  small?: boolean;
};
export const Bar = ({ label, value, max, className, subtle }: BarProps) => {
  const pct = Math.round((value / Math.max(1, max)) * 100);
  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="mb-1 flex items-center justify-between text-[10px] text-zinc-400">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        className={`h-2 w-full rounded bg-zinc-800 ${
          subtle ? "opacity-50" : ""
        }`}
      >
        <div
          style={{ width: `${pct}%` }}
          className={`h-2 rounded ${
            label === "체력"
              ? "bg-red-600"
              : label === "궁극기"
              ? "bg-emerald-600"
              : "bg-sky-600"
          }`}
        />
      </div>
    </div>
  );
};
