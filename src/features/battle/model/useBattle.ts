// features/battle/model/useBattle.ts
import { useEffect, useRef, useState } from "react";
import { STAGES } from "../../../entities/stage/model/stages";
import type { UnitBase, UnitRuntime } from "../../../entities/unit/model/types";
import {
  cloneRuntime,
  dealDamage,
  getAlive,
  getBlueprint,
  randomTarget,
} from "./battleLogic";

export const useBattle = (pushLog: (s: string) => void) => {
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [waveIdx, setWaveIdx] = useState<number>(0);
  const [playerUnits, setPlayerUnits] = useState<UnitRuntime[]>([]);
  const [enemyUnits, setEnemyUnits] = useState<UnitRuntime[]>([]);
  const [result, setResult] = useState<null | {
    win: boolean;
    crystals: number;
  }>(null);
  const [paused, setPaused] = useState<boolean>(false);

  // 최신 상태/플래그 ref
  const playerRef = useRef<UnitRuntime[]>([]);
  const enemyRef = useRef<UnitRuntime[]>([]);
  const pausedRef = useRef<boolean>(false);
  const endedRef = useRef<boolean>(false);
  const waveRef = useRef<number>(0); // waveIdx 최신값 저장용

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
    waveRef.current = waveIdx; // state → ref 동기화
  }, [waveIdx]);

  const tickRef = useRef<number | null>(null);
  const stopLoop = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startBattle = (party: string[], collection: UnitBase[]) => {
    const stage = STAGES[stageIdx % STAGES.length];
    const selection = party
      .map((pid) => collection.find((b) => b.id === pid))
      .filter((b): b is UnitBase => Boolean(b));
    if (selection.length === 0) return;

    const firstWave = stage.waves[0]!;
    const enemies = firstWave.map((eid) =>
      cloneRuntime(getBlueprint(eid), "적")
    );
    const players = selection.map((b) => cloneRuntime(b, "아군"));

    endedRef.current = false;
    waveRef.current = 0; // 전투 시작 시 초기화
    setPlayerUnits(players);
    setEnemyUnits(enemies);
    setWaveIdx(0);
    setResult(null);
    pushLog(`▶ ${stage.name} 에 돌입합니다.`);
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

  const tryNextWaveOrEnd = (
    incCrystal: (fn: (c: number) => number) => void
  ) => {
    const stage = STAGES[stageIdx % STAGES.length];
    const nextWave = waveRef.current + 1; // ref에서 최신값 읽기

    if (nextWave >= stage.waves.length) {
      const reward = stage.rewardCrystals;
      incCrystal((c) => c + reward);
      endBattleOnce({
        win: true,
        crystals: reward,
        log: `✔ ${stage.name} 클리어! 보상 +${reward} 결정`,
      });
      return;
    }

    const wave = stage.waves[nextWave]!;
    const enemies = wave.map((eid) => cloneRuntime(getBlueprint(eid), "적"));
    setEnemyUnits(enemies);
    setWaveIdx(nextWave); // UI 갱신용 state (ref는 useEffect로 자동 동기화됨)
    pushLog(`— 웨이브 ${nextWave + 1} 시작 —`);
  };

  const runLoop = (incCrystal: (fn: (c: number) => number) => void) => {
    stopLoop();

    const step = () => {
      if (pausedRef.current || endedRef.current) return;

      const pNow = playerRef.current.map((x) => ({ ...x }));
      const eNow = enemyRef.current.map((x) => ({ ...x }));

      if (getAlive(pNow).length === 0) {
        endBattleOnce({
          win: false,
          crystals: 0,
          log: "☠️ 패배했습니다. 왕국은 여전히 버팁니다...",
        });
        return;
      }
      if (getAlive(eNow).length === 0) {
        tryNextWaveOrEnd(incCrystal);
        return;
      }

      const pSpeed =
        getAlive(pNow).reduce((s, u) => s + u.speed, 0) /
        Math.max(1, getAlive(pNow).length);
      const eSpeed =
        getAlive(eNow).reduce((s, u) => s + u.speed, 0) /
        Math.max(1, getAlive(eNow).length);
      const side =
        Math.random() < pSpeed / (pSpeed + eSpeed) ? "player" : "enemy";

      if (side === "player") {
        const actor = randomTarget(getAlive(pNow));
        const target = randomTarget(getAlive(eNow));
        if (actor && target) {
          const d = dealDamage(target, actor.atk);
          pushLog(
            `${actor.emoji} ${actor.name}가 ${target.name}을(를) 공격하여 ${d.dmg} 피해`
          );
          actor.charge = Math.min(100, actor.charge + 20);
          setEnemyUnits(eNow);
          setPlayerUnits(pNow);
        }
      } else {
        const actor = randomTarget(getAlive(eNow));
        const target = randomTarget(getAlive(pNow));
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

    tickRef.current = window.setInterval(step, 800);
  };

  useEffect(() => () => stopLoop(), []);

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
        caster.charge = 0; // ✅ 초기화
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
    startBattle,
    runLoop,
    castUlt,
  };
};
