import React from "react";
import type { UnitBase } from "../../entities/unit/model/types";
import { toAbs } from "../../shared/lib/toAbs";

type UnitWithInventory = UnitBase & { inventoryId: string };

type Props = {
  units: UnitWithInventory[];
  onClick: (inventoryId: string) => void;
  party: string[]; // inventoryId[]
};

const stars = (n: number) => "★".repeat(n);

export const CollectionGrid: React.FC<Props> = ({ units, onClick, party }) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-3 md:grid-cols-4">
      {units.map((u) => {
        const selected = party.includes(u.inventoryId);
        const src = toAbs(u.img);

        return (
          <button
            key={u.inventoryId}
            onClick={() => onClick(u.inventoryId)}
            className={[
              "group relative overflow-hidden rounded-lg border",
              selected
                ? "border-amber-400 ring-2 ring-amber-300"
                : "border-zinc-800",
            ].join(" ")}
            style={{ width: 240, height: 340 }} // 100x80 비율보다 약간 여유
            aria-pressed={selected}
          >
            {/* 이미지 */}
            {src ? (
              <img
                src={src}
                alt={u.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-zinc-800/30" />
            )}

            {/* 상단 좌측: 희귀도/직업 등 작은 상태 */}
            <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-1">
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-amber-300">
                {stars(u.rarity ?? 1)}
              </span>
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-zinc-100">
                {u.role}
              </span>
            </div>

            {/* 상단 우측: 파티 여부 배지 */}
            {selected && (
              <div className="pointer-events-none absolute right-1 top-1 rounded-md bg-emerald-600/80 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
                파티 중
              </div>
            )}

            {/* 하단: 이름 + 레벨/족속 등 */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              {/* 그라디언트 배경 */}
              <div className="h-12 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* 텍스트 라벨 */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 pb-1">
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-white">
                    {u.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-200/90">
                    <span>Lv.{u.level ?? 1}</span>
                    <span>·</span>
                    <span>{u.tribe}</span>
                  </div>
                </div>
                {/* 우측: 스탯 요약(원하면 다른 값으로 교체) */}
                <div className="ml-2 shrink-0 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-zinc-100">
                  ATK {u.atk}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
