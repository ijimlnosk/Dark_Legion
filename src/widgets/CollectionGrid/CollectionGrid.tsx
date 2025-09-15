import React, { useMemo } from "react";
import { Chip } from "../../shared/ui/Chip";
import { Stat } from "../../entities/unit/ui/Stat";
import type { UnitBase } from "../../entities/unit/model/types";

const formatRarity = (r: number) => "★".repeat(r);

type Props = {
  units: UnitBase[];
  onClick: (id: string) => void;
  party: string[];
};

export const CollectionGrid: React.FC<Props> = ({ units, onClick, party }) => {
  const countById = useMemo(() => {
    const m = new Map<string, number>();
    for (const u of units) m.set(u.id, (m.get(u.id) ?? 0) + 1);
    return m;
  }, [units]);

  const uniqueById = useMemo(() => {
    const map = new Map<string, UnitBase>();
    for (const u of units) if (!map.has(u.id)) map.set(u.id, u);
    return Array.from(map.values());
  }, [units]);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {uniqueById.map((u) => {
        const selected = party.includes(u.id);
        const count = countById.get(u.id) ?? 1;

        return (
          <button
            key={u.id}
            onClick={() => onClick(u.id)}
            className={[
              "group relative overflow-hidden rounded-2xl border text-left transition",
              "hover:scale-[1.01]",
              selected ? "border-emerald-500/70" : "border-zinc-800",
            ].join(" ")}
          >
            {/* 이미지 컨테이너: 원하는 비율로 고정 (예: 4:3). 높이 고정 원하면 h-36 그대로 사용 */}
            <div className="relative w-full aspect-[2/3] bg-zinc-900">
              {/* 잘림 방지: object-contain (배경에 여백/레터박스) */}
              {/* 잘라도 되면 object-cover 로 바꾸기 */}
              <img
                src={u.img}
                alt={u.name}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />

              {/* 상단 유리감/윤곽 */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/40" />

              {/* 상단 우측: 보유 개수 */}
              {count > 1 && (
                <div className="absolute right-2 top-2 rounded-full border border-amber-400/60 bg-amber-900/70 px-2 py-0.5 text-[10px] text-amber-100">
                  x{count}
                </div>
              )}

              {/* 하단 그라데이션 + 텍스트 오버레이 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3">
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="relative z-[1] flex items-center justify-between">
                  <span className="text-2xl">{u.emoji}</span>
                  <Chip>{formatRarity(u.rarity)}</Chip>
                </div>
                <div className="relative z-[1]">
                  <div className="text-sm font-semibold text-zinc-100">
                    {u.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-300">
                    {u.tribe} • {u.role}
                  </div>
                </div>

                {/* 스탯 줄바꿈 없이 얇게 */}
                <div className="relative z-[1] mt-1 grid grid-cols-3 gap-1 text-center text-[10px] text-zinc-200">
                  <Stat v={u.hpMax} label="체력" />
                  <Stat v={u.atk} label="공격" />
                  <Stat v={u.speed} label="속도" />
                </div>
              </div>

              {/* 선택 상태 하이라이트 글로우 */}
              {selected && (
                <div className="pointer-events-none absolute inset-0 ring-2 ring-emerald-400/40" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
