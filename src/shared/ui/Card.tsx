export function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-2 text-lg font-semibold text-zinc-100">{title}</div>
      {desc && <div className="mb-3 text-sm text-zinc-400">{desc}</div>}
      <div>{children}</div>
    </div>
  );
}
