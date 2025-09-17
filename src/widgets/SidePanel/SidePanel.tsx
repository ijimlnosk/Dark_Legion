// widgets/SidePanel/SidePanel.tsx
import React from "react";
import type { UnitRuntime } from "../../entities/unit/model/types";
import UnitCard from "../../entities/unit/ui/UnitCard";

type Props = {
  title: string;
  units: UnitRuntime[];
  isPlayer?: boolean;
  onUlt?: (id: string) => void;
};

export const SidePanel: React.FC<Props> = ({
  title,
  units,
  isPlayer,
  onUlt,
}) => {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3">
      <h3 className="mb-2 text-sm font-semibold text-zinc-300">{title}</h3>

      {/* ✅ auto-fit + minmax 로 카드가 자동 줄바꿈/축소 */}
      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
        {units.map((u, idx) => (
          <UnitCard key={idx} unit={u} isPlayer={isPlayer} onUlt={onUlt} />
        ))}
      </div>
    </section>
  );
};
