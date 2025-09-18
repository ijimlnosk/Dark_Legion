import { useEffect, useRef, useState } from "react";
import type { UnitBase, UnitRuntime } from "../../../entities/unit/model/types";
import {
  cloneRuntime,
  dealDamage,
  getAlive,
  randomTarget,
} from "./battleLogic";
import { BASE } from "../../../shared/api/client";
import { toAbs } from "../../../shared/lib/toAbs";

type Stage = {
  id: string;
  name: string;
  waves: string[][];
  rewardCrystals: number;
};

async function fetchUnitsByIds(ids: string[]): Promise<UnitBase[]> {
  const uniq = Array.from(new Set(ids));
  const url = `${BASE}/units?ids=${encodeURIComponent(uniq.join(","))}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-user-name": "dev",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch units: ${res.status}`);
  return (await res.json()) as UnitBase[];
}

export const useBattle = (pushLog: (s: string) => void) => {
  const [stageIdx, setStageIdx] = useState(0);
  const [waveIdx, setWaveIdx] = useState(0);
  const [playerUnits, setPlayerUnits] = useState<UnitRuntime[]>([]);
  const [enemyUnits, setEnemyUnits] = useState<UnitRuntime[]>([]);
  const [result, setResult] = useState<null | {
    win: boolean;
    crystals: number;
  }>(null);
  const [paused, setPaused] = useState(false);

  const playerRef = useRef<UnitRuntime[]>([]);
  const enemyRef = useRef<UnitRuntime[]>([]);
  const pausedRef = useRef(false);
  const endedRef = useRef(false);
  const waveRef = useRef(0);
  const tickRef = useRef<number | null>(null);

  // 🔥 블루프린트 캐시(id -> UnitBase)
  const bpCache = useRef<Map<string, UnitBase>>(new Map());

  useEffect(() => {
    playerRef.current = playerUnits;
  }, [playerUnits]);
  useEffect(() => {
    enemyRef.current = enemyUnits;
  }, [enemyUnits]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    waveRef.current = waveIdx;
  }, [waveIdx]);

  const stopLoop = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  // 필요 id들 중 캐시에 없는 것만 모아서 한 번에 fetch
  const ensureBlueprints = async (ids: string[]) => {
    const missing = ids.filter((id) => !bpCache.current.has(id));
    if (missing.length === 0) return;
    const fetched = await fetchUnitsByIds(missing);
    for (const u of fetched) {
      // img 절대경로 보정 (백엔드가 상대경로 주면 toAbs로)
      bpCache.current.set(u.id, { ...u, img: toAbs(u.img) });
    }
  };

  const getBlueprint = (id: string) => {
    const bp = bpCache.current.get(id);
    if (!bp) throw new Error(`Blueprint not loaded for id=${id}`);
    return bp;
  };

  // ✅ 이제 party는 UnitBase[] 그대로 받음
  const startBattle = async (partyUnits: UnitBase[], stage: Stage) => {
    if (partyUnits.length === 0) {
      pushLog("⚠️ 파티가 비어있습니다.");
      return;
    }

    // 1웨이브 적 블루프린트 확보
    const firstWave = stage.waves[0] ?? [];
    await ensureBlueprints(firstWave);

    const enemies = firstWave.map((eid) =>
      cloneRuntime(getBlueprint(eid), "적")
    );
    const players = partyUnits.map((b) => cloneRuntime(b, "아군"));

    endedRef.current = false;
    waveRef.current = 0;
    // 이전 루프 정지 및 상태 초기화
    stopLoop();
    setResult(null);
    setWaveIdx(0);
    setPlayerUnits(players);
    setEnemyUnits(enemies);
    pushLog(`▶ ${stage.name} 전투 시작!`);
  };

  const endBattleOnce = (payload: {
    win: boolean;
    crystals: number;
    log: string;
  }) => {
    if (endedRef.current) return;
    endedRef.current = true;
    stopLoop();
    setResult({ win: payload.win, crystals: payload.crystals });
    pushLog(payload.log);
  };

  const tryNextWaveOrEnd = async (stage: Stage) => {
    const nextWave = waveRef.current + 1;
    if (nextWave >= stage.waves.length) {
      const reward = stage.rewardCrystals;
      endBattleOnce({
        win: true,
        crystals: reward,
        log: `✔ ${stage.name} 클리어! 보상 +${reward} 결정`,
      });
      return;
    }

    const wave = stage.waves[nextWave] ?? [];
    await ensureBlueprints(wave);
    const enemies = wave.map((eid) => cloneRuntime(getBlueprint(eid), "적"));
    // 웨이브 교체는 원자적으로 처리
    setEnemyUnits(enemies);
    setWaveIdx(nextWave);
    pushLog(`— 웨이브 ${nextWave + 1} 시작 —`);
  };

  const runLoop = (stage: Stage) => {
    stopLoop();

    const step = () => {
      if (pausedRef.current || endedRef.current) return;

      const pNow = playerRef.current.map((x) => ({ ...x }));
      const eNow = enemyRef.current.map((x) => ({ ...x }));

      // 종료 판정
      // 전투가 시작되기 전에 빈 상태로 판정되는 것을 방지
      if (pNow.length === 0 || eNow.length === 0) {
        return;
      }
      if (getAlive(pNow).length === 0) {
        endBattleOnce({
          win: false,
          crystals: 0,
          log: "☠️ 패배했습니다. 왕국은 여전히 버팁니다...",
        });
        return;
      }
      if (getAlive(eNow).length === 0) {
        // 다음 웨이브 로딩은 비동기라서 step에서 직접 await하지 않고 큐에 태움
        (async () => {
          await tryNextWaveOrEnd(stage);
        })();
        return;
      }

      // 속도 기반 턴 결정
      const pAlive = getAlive(pNow);
      const eAlive = getAlive(eNow);
      const pSpeed =
        pAlive.reduce((s, u) => s + u.speed, 0) / Math.max(1, pAlive.length);
      const eSpeed =
        eAlive.reduce((s, u) => s + u.speed, 0) / Math.max(1, eAlive.length);
      const side =
        Math.random() < pSpeed / (pSpeed + eSpeed) ? "player" : "enemy";

      if (side === "player") {
        const actor = randomTarget(pAlive);
        const target = randomTarget(eAlive);
        if (actor && target) {
          const d = dealDamage(target, actor.atk);
          pushLog(
            `${actor.emoji} ${actor.name}가 ${target.name}에게 ${d.dmg} 피해`
          );
          actor.charge = Math.min(100, actor.charge + 20);
          setEnemyUnits(eNow);
          setPlayerUnits(pNow);
        }
      } else {
        const actor = randomTarget(eAlive);
        const target = randomTarget(pAlive);
        if (actor && target) {
          const d = dealDamage(target, actor.atk * 0.95);
          pushLog(
            `${actor.emoji} ${actor.name}의 공격! ${target.name}이(가) ${d.dmg} 피해`
          );
          actor.charge = Math.min(100, actor.charge + 18);
          setPlayerUnits(pNow);
          setEnemyUnits(eNow);
        }
      }
    };

    if (!tickRef.current) {
      tickRef.current = window.setInterval(step, 800);
    }
  };

  const castUlt = (casterId: string) => {
    if (endedRef.current) return;
    setPlayerUnits((prev) => {
      const pArr = prev.map((u) => ({ ...u }));
      const caster = pArr.find((u) => u.id === casterId);
      if (!caster || !caster.alive || caster.charge < 100) return prev;

      const eArr = enemyRef.current.map((u) => ({ ...u }));
      const t = randomTarget(getAlive(eArr));
      if (t) {
        const d = dealDamage(t, caster.atk * 2);
        pushLog(
          `${caster.emoji} ${caster.name}의 궁극기! ${t.name}에게 ${d.dmg} 피해`
        );
        caster.charge = 0;
        setEnemyUnits(eArr);
      }
      return pArr;
    });
  };

  return {
    stageIdx,
    setStageIdx,
    waveIdx,
    playerUnits,
    enemyUnits,
    result,
    paused,
    setPaused,
    startBattle, // 이제 async (호출부에서 await 가능)
    runLoop,
    castUlt,
  };
};
