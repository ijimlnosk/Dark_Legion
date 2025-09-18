import React from "react";
import type { UnitBase } from "../../entities/unit/model/types";
import { toAbs } from "../../shared/lib/toAbs";
import { useFuse } from "../../features/me/model/useFuse";
import ConfirmModal from "../../shared/ui/ConfirmModal";

type UnitWithInventory = UnitBase & { inventoryId: string };

type Props = {
  units: UnitWithInventory[];
  onClick: (inventoryId: string) => void;
  party: string[]; // inventoryId[]
};

const stars = (n: number) => "★".repeat(n);

export const CollectionGrid: React.FC<Props> = ({ units, onClick, party }) => {
  const fuse = useFuse();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const fuseRef = React.useRef<{ target: string; materials: string[] } | null>(
    null
  );
  const [selectedName, setSelectedName] = React.useState<string>("");
  // 동일 캐릭터(id) 기준으로 그룹화하여 x n 표기
  const groups = React.useMemo(() => {
    const map = new Map<string, UnitWithInventory[]>();
    for (const u of units) {
      const arr = map.get(u.id) ?? [];
      arr.push(u);
      map.set(u.id, arr);
    }
    return Array.from(map.entries()).map(([id, list]) => ({
      id,
      list,
      rep: list[0],
      count: list.length,
    }));
  }, [units]);

  return (
    <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-3 md:grid-cols-4">
      {groups.map(({ id, list, rep, count }) => {
        const selectedInventoryId = party.find((pid) =>
          list.some((u) => u.inventoryId === pid)
        );
        const selected = Boolean(selectedInventoryId);
        const src = toAbs(rep.img);

        const handleClick = () => {
          const targetInventoryId = selectedInventoryId ?? list[0].inventoryId;
          onClick(targetInventoryId);
        };

        const canFuse = count >= 2;
        const openConfirm = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!canFuse || fuse.isPending) return;
          const target = selectedInventoryId ?? list[0].inventoryId;
          const materials = list
            .map((u) => u.inventoryId)
            .filter((inv) => inv !== target)
            .slice(0, 1);
          if (materials.length === 0) return;
          fuseRef.current = { target, materials };
          setSelectedName(rep.name);
          setConfirmOpen(true);
        };

        return (
          <div
            key={id}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
            className={[
              "group relative overflow-hidden rounded-lg border",
              selected
                ? "border-amber-400 ring-2 ring-amber-300"
                : "border-zinc-800",
            ].join(" ")}
            style={{ width: 240, height: 340 }}
            aria-pressed={selected}
            title={`${rep.name} • ${rep.tribe} • ${rep.role} • Lv.${rep.level}`}
          >
            {src ? (
              <img
                src={src}
                alt={rep.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-zinc-800/30" />
            )}

            <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-1">
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-amber-300">
                {stars(rep.rarity ?? 1)}
              </span>
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-zinc-100">
                {rep.role}
              </span>
            </div>

            <div className="pointer-events-auto absolute right-1 top-1 flex flex-col items-end gap-1">
              {selected && (
                <div className="rounded-md bg-emerald-600/80 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
                  파티 중
                </div>
              )}
              {count > 1 && (
                <div className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-zinc-100">
                  x {count}
                </div>
              )}
              {canFuse && (
                <button
                  type="button"
                  onClick={openConfirm}
                  disabled={fuse.isPending}
                  className="rounded-md bg-violet-600/90 hover:bg-violet-700 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow disabled:opacity-60"
                  title="동일 캐릭터 합성"
                >
                  {fuse.isPending ? "합성중…" : "합성"}
                </button>
              )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="h-12 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 pb-1">
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold text-white">
                    {rep.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-200/90">
                    <span>Lv.{rep.level ?? 1}</span>
                    <span>·</span>
                    <span>{rep.tribe}</span>
                  </div>
                </div>
                <div className="ml-2 shrink-0 flex items-center gap-1">
                  <div
                    className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-zinc-100"
                    title={`최대 체력`}
                  >
                    HP {rep.hpMax}
                  </div>
                  <div
                    className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-zinc-100"
                    title={`공격력`}
                  >
                    ATK {rep.atk}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* 전역 1회 렌더링 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        title="합성 진행할까요?"
        description={`${selectedName}\n같은 캐릭터 1장을 소모하여 레벨을 +1 합니다.`}
        confirmText="합성"
        cancelText="취소"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          const payload = fuseRef.current;
          if (!payload) return setConfirmOpen(false);
          fuse.mutate(
            {
              targetInventoryId: payload.target,
              materialInventoryIds: payload.materials,
            },
            {
              onSettled: () => setConfirmOpen(false),
            }
          );
        }}
      />
    </div>
  );
};
