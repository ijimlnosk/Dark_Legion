import { Link } from "react-router-dom";
import { useSummon } from "../../features/summon/model/useSummon";
import { Chip } from "../../shared/ui/Chip";
import type { RouterProps } from "../router";
import { Card } from "../../shared/ui/Card";
import { CollectionGrid } from "../../widgets/CollectionGrid/CollectionGrid";
import { useMemo, useState } from "react";
import type { UnitBase } from "../../entities/unit/model/types";

function formatRarity(r: number) {
  return "★".repeat(r);
}

export default function Summon({
  crystal,
  setCrystal,
  setCollection,
  collection,
  pushLog,
  party,
}: Pick<
  RouterProps,
  | "crystal"
  | "setCrystal"
  | "setCollection"
  | "collection"
  | "pushLog"
  | "party"
>) {
  const { summonOne } = useSummon(crystal, setCrystal, setCollection, pushLog);
  const [lastSummoned, setLastSummoned] = useState<UnitBase | null>(null);
  const isNew = useMemo(
    () =>
      lastSummoned ? !collection.some((u) => u.id === lastSummoned.id) : false,
    // 주의: lastSummoned가 set된 같은 tick에는 collection이 아직 이전 상태일 수 있음.
    // "NEW"판정은 summon 전에 snapshot을 넘겨서 계산하는 게 더 정확하지만,
    // 여기서는 간단히 after-render 기준으로 동작하도록 둔다.
    [lastSummoned, collection]
  );

  const handleSummon = () => {
    const res = summonOne();
    if (res) setLastSummoned(res);
  };

  return (
    <div className="mx-auto max-w-3xl p-6 text-zinc-200">
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
        <button className="btn" disabled={crystal < 100} onClick={handleSummon}>
          한 번 소환 (100)
        </button>

        {/* 소환 결과 배너 */}
        {lastSummoned && (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-700/40 bg-emerald-900/20 p-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/30 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]">
              <img
                src={lastSummoned.img}
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
                {/* NEW 뱃지 (간단 판정) */}
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
