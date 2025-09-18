import { useEffect, useMemo, useState } from "react";
import { useCatalog, useStages } from "../../features/stage/model/useStage";
import { useManualBattle } from "../../features/battle/model/useManualBattle";
import ManualUnitCard from "../../entities/unit/ui/ManualUnitCard";
import { useMeState } from "../../features/me/model/useMeState";

export default function ManualBattle() {
  const { data: stages } = useStages();
  const [stageIdx, setStageIdx] = useState(0);
  const stage = stages?.[stageIdx % (stages?.length ?? 1)];

  const {
    start,
    act,
    order,
    units,
    turnIdx,
    logs,
    finished,
    winner,
    loading,
    currentActorId,
  } = useManualBattle();

  useEffect(() => {
    if (!stage) return;
    start(stage.id, 0);
  }, [stage?.id]);

  const aliveAllies = useMemo(
    () => Object.values(units).filter((u) => u.side === "ALLY" && u.alive),
    [units]
  );
  const aliveEnemies = useMemo(
    () => Object.values(units).filter((u) => u.side === "ENEMY" && u.alive),
    [units]
  );

  const actor = currentActorId ? units[currentActorId] : undefined;

  // 아군 이미지 매핑: A_{inventoryId}에서 inventoryId 추출 후 me.collection에서 이미지 참조
  const { data: me } = useMeState();
  const { data: catalog } = useCatalog();
  const invToImage = useMemo(() => {
    const map = new Map<string, string | undefined>();
    (me?.collection ?? []).forEach((u) => map.set(u.inventoryId, u.img));
    return map;
  }, [me?.collection]);
  const enemyIdToImg = useMemo(() => {
    const map = new Map<string, string | undefined>();
    (catalog ?? []).forEach((u) => map.set(u.id, u.img));
    return map;
  }, [catalog]);
  const getImgForId = (unitId: string) => {
    if (unitId.startsWith("A_")) {
      const invId = unitId.slice(2);
      return invToImage.get(invId);
    }
    if (unitId.startsWith("E_")) {
      // 형식: E_{idx}_{unitId}
      const parts = unitId.split("_");
      const enemyUnitId = parts.slice(2).join("_");
      return enemyIdToImg.get(enemyUnitId);
    }
    return undefined;
  };

  return (
    <div className="p-4 text-zinc-200">
      <header className="mb-3 flex items-center gap-2">
        <h2 className="text-xl font-bold">수동 전투 (실험)</h2>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="btn-sub"
            onClick={() =>
              stages &&
              setStageIdx((i) => (i - 1 + stages.length) % stages.length)
            }
          >
            ◀ 이전
          </button>
          <div className="px-2 text-sm">{stage?.name ?? "로딩중"}</div>
          <button
            className="btn-sub"
            onClick={() =>
              stages && setStageIdx((i) => (i + 1) % stages.length)
            }
          >
            다음 ▶
          </button>
          <button
            className="btn"
            onClick={() => stage && start(stage.id, 0)}
            disabled={loading}
          >
            재시작
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3">
          <h3 className="mb-1 text-sm font-semibold text-zinc-300">왕국군</h3>
          <div className="mb-2 text-xs text-zinc-400">
            {actor?.side === "ALLY"
              ? "적 카드를 클릭하면 현재 턴 아군이 공격합니다."
              : "지금은 적의 턴입니다. 아래 아군 카드로 타겟을 선택하세요."}
          </div>
          <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
            {aliveEnemies.map((u) => (
              <ManualUnitCard
                key={u.id}
                id={u.id}
                name={u.name}
                img={getImgForId(u.id)}
                hp={u.hp}
                hpMax={u.hpMax}
                alive={u.alive}
                isEnemy
                isActive={actor?.side === "ALLY"}
                onClick={
                  actor && actor.side === "ALLY"
                    ? () => act("ATTACK", u.id)
                    : undefined
                }
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3">
          <h3 className="mb-2 text-sm font-semibold text-zinc-300">내 군단</h3>
          <div className="mb-2 text-xs text-zinc-400">
            {actor?.side === "ENEMY"
              ? "아군 카드를 클릭하면 적의 공격 대상이 됩니다."
              : "지금은 아군의 턴입니다. 위 적 카드에서 타겟을 선택하세요."}
          </div>
          <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
            {aliveAllies.map((u) => (
              <ManualUnitCard
                key={u.id}
                id={u.id}
                name={u.name}
                img={getImgForId(u.id)}
                hp={u.hp}
                hpMax={u.hpMax}
                alive={u.alive}
                isActive={actor?.id === u.id}
                onClick={
                  actor?.side === "ENEMY"
                    ? () => act("ATTACK", u.id)
                    : undefined
                }
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="btn"
              onClick={() =>
                actor &&
                actor.side === "ALLY" &&
                aliveEnemies[0] &&
                act("ATTACK", aliveEnemies[0].id)
              }
              disabled={
                !actor ||
                actor.side !== "ALLY" ||
                !aliveEnemies.length ||
                loading
              }
            >
              현재 턴: 기본 공격
            </button>
          </div>
        </section>
      </div>

      <section className="mt-4">
        <div className="text-sm text-zinc-400">
          턴 순서: {order.join(" → ")}
        </div>
        <div className="text-sm">현재 턴: {turnIdx + 1}</div>
        {finished && (
          <div className="mt-2 text-emerald-400 font-semibold">
            전투 종료: {winner === "ALLY" ? "승리" : "패배"}
          </div>
        )}
      </section>

      <section className="mt-4">
        <h3 className="mb-2 font-semibold">로그</h3>
        <div className="max-h-48 overflow-auto rounded-lg border border-zinc-800 p-2 text-sm">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
