import React from "react";
import clsx from "clsx";
import { toAbs } from "../../../shared/lib/toAbs";

type Props = {
  id: string;
  name: string;
  img?: string | null;
  hp: number;
  hpMax: number;
  alive: boolean;
  isActive?: boolean;
  onClick?: () => void;
  isEnemy?: boolean;
};

const ManualUnitCard: React.FC<Props> = ({
  name,
  img,
  hp,
  hpMax,
  alive,
  isActive,
  onClick,
  isEnemy,
}) => {
  const hpPct = Math.max(
    0,
    Math.min(100, Math.round((hp / Math.max(1, hpMax)) * 100))
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={clsx(
        "rounded-xl bg-zinc-900/60 p-2 sm:p-3 text-left",
        isActive && "ring-2 ring-amber-400",
        !onClick && "cursor-default"
      )}
      title={`${name} — HP ${hp}/${hpMax}`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative mx-auto w-[clamp(120px,22vw,160px)] aspect-[2/3]">
          {img ? (
            <img
              src={toAbs(img)}
              alt={name}
              className={clsx(
                "absolute inset-0 h-full w-full object-cover",
                !alive && "grayscale"
              )}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-zinc-800/50 text-zinc-400">
              IMG
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 p-2">
            <div
              className="w-full rounded-md bg-zinc-800/80"
              title={`HP ${hp}/${hpMax}`}
            >
              <div
                className={clsx(
                  "h-2 rounded-md",
                  isEnemy ? "bg-rose-500" : "bg-emerald-500"
                )}
                style={{ width: `${hpPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
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
    </button>
  );
};

export default ManualUnitCard;
