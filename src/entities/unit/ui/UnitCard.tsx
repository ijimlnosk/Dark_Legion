import React from "react";
import clsx from "clsx";
import type { UnitRuntime } from "../../unit/model/types";
import { toAbs } from "../../../shared/lib/toAbs";

type Props = {
  unit: UnitRuntime;
  isPlayer?: boolean;
  onUlt?: (id: string) => void;
  className?: string;
};

export const UnitCard: React.FC<Props> = ({
  unit,
  isPlayer,
  onUlt,
  className,
}) => {
  const { id, name, alive, hp, hpMax, charge = 0, img } = unit;

  const hpPct = Math.max(
    0,
    Math.min(100, Math.round((hp / Math.max(1, hpMax)) * 100))
  );
  const ultPct = Math.max(0, Math.min(100, Math.round(charge)));
  const canCastUlt = Boolean(isPlayer && alive && ultPct >= 100 && onUlt);

  return (
    <div className={clsx("rounded-xl bg-zinc-900/60 p-2 sm:p-3", className)}>
      <div className="relative overflow-hidden rounded-lg">
        {/* 폭은 clamp, 세로는 비율 고정 → 화면이 줄면 같이 줄어듦 */}
        <div className="relative mx-auto w-[clamp(120px,22vw,160px)] aspect-[2/3]">
          <img
            src={toAbs(img)}
            alt={name}
            className={clsx(
              "absolute inset-0 h-full w-full object-cover",
              !alive && "grayscale"
            )}
            draggable={false}
          />
          {/* 게이지 오버레이 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 p-2">
            <div
              className="w-full rounded-md bg-zinc-800/80"
              title={`HP ${hp}/${hpMax}`}
            >
              <div
                className="h-2 rounded-md bg-rose-500"
                style={{ width: `${hpPct}%` }}
              />
            </div>
            <div
              className="w-full rounded-md bg-zinc-800/80"
              title={`ULT ${ultPct}%`}
            >
              <div
                className="h-2 rounded-md bg-amber-400"
                style={{ width: `${ultPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 텍스트도 clamp로 미세 축소 */}
      <div className="mt-2 flex items-center justify-between text-[clamp(10px,2.4vw,14px)]">
        <div className="font-semibold truncate">{name}</div>
        <div
          className={clsx(
            "ml-2 text-xs",
            alive ? "text-emerald-400" : "text-zinc-400"
          )}
        >
          {alive ? "생존" : "전투불능"}
        </div>
      </div>

      {isPlayer && (
        <button
          type="button"
          onClick={() => onUlt?.(id)}
          disabled={!canCastUlt}
          className={clsx(
            "mt-2 w-full rounded-lg px-3 py-2 text-[clamp(10px,2.2vw,13px)] font-semibold transition",
            canCastUlt
              ? "bg-amber-500 hover:bg-amber-600 text-zinc-900"
              : "bg-zinc-800 text-zinc-400 cursor-not-allowed"
          )}
          title={canCastUlt ? "궁극기 발동!" : "게이지가 100%일 때 사용 가능"}
        >
          궁극기
        </button>
      )}
    </div>
  );
};

export default UnitCard;
