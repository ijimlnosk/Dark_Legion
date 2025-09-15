import { useEffect } from "react";

const styles = `
.btn { @apply rounded-xl border border-emerald-700/60 bg-emerald-900/40 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-900/60 transition disabled:opacity-50 }
.btn-sub { @apply rounded-xl border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900/70 transition disabled:opacity-50 }
` as unknown as string;

export const StyleInjector: React.FC = () => {
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = styles as unknown as string;
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(s);
    };
  }, []);
  return null;
};
