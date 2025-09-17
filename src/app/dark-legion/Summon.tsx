import { Link } from "react-router-dom";
import { useMeState } from "../../features/me/model/useMeState";
import { useSummonOne } from "../../features/summon/model/useSummon";
import { useMemo, useState } from "react";
import type { OwnedUnit } from "../../entities/unit/model/types";
import { Chip } from "../../shared/ui/Chip";
import { Card } from "../../shared/ui/Card";
import { CollectionGrid } from "../../widgets/CollectionGrid/CollectionGrid";
import { toAbs } from "../../shared/lib/toAbs";

function formatRarity(r: number) {
  return "★".repeat(r);
}

export default function Summon() {
  const { data: me } = useMeState();
  const { mutate: summonOne, isPending } = useSummonOne();
  const [lastSummoned, setLastSummoned] = useState<OwnedUnit | null>(null);

  const crystal = me?.crystal ?? 0;
  const party = me?.party ?? [];
  const collection = me?.collection ?? [];

  const isNew = useMemo(
    () =>
      lastSummoned ? !collection.some((u) => u.id === lastSummoned.id) : false,
    [lastSummoned, collection]
  );

  return (
    <div className="mx-auto max-w-5xl p-6 text-zinc-200">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">🜁 소환</h2>
        <div className="flex items-center gap-3">
          <Chip>결정: {crystal}</Chip>
          <Link className="btn-sub" to="/">
            뒤로
          </Link>
        </div>
      </header>

      <Card title="소환" desc="소환 1회당 결정 100개가 필요합니다.">
        <button
          className="btn"
          disabled={crystal < 100 || isPending}
          onClick={() =>
            summonOne(undefined, { onSuccess: (d) => setLastSummoned(d.unit) })
          }
        >
          한 번 소환 (100)
        </button>

        {lastSummoned && (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-700/40 bg-emerald-900/20 p-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/30 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]">
              <img
                src={toAbs(lastSummoned.img)}
                alt={lastSummoned.name}
                className="h-[100px] w-[100px] object-cover object-center brightness-95"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/40" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-lg">{lastSummoned.emoji}</div>
                <div className="text-sm font-semibold text-zinc-100">
                  {lastSummoned.name}
                </div>
                <Chip>{formatRarity(lastSummoned.rarity)}</Chip>
                {isNew && <Chip>NEW</Chip>}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {lastSummoned.tribe} • {lastSummoned.role}
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">
                체력 {lastSummoned.hpMax} / 공격 {lastSummoned.atk} / 속도{" "}
                {lastSummoned.speed}
              </div>
            </div>
          </div>
        )}
      </Card>

      <section className="mt-8">
        <h3 className="mb-2 text-lg font-semibold">보유 마족 목록</h3>
        <CollectionGrid units={collection} onClick={() => {}} party={party} />
      </section>
    </div>
  );
}
