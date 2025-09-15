// pages/Battle/index.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UnitBase } from "../../entities/unit/model/types";
import { STAGES } from "../../entities/stage/model/stages";
import { Chip } from "../../shared/ui/Chip";
import { SidePanel } from "../../widgets/SidePanel/SidePanel";
import { useBattle } from "../../features/battle/model/useBattle";
import ResultModal from "../../widgets/ResultModal/ResultModal";

export default function Battle({
  crystal,
  setCrystal,
  party,
  collection,
  log,
  pushLog,
}: {
  crystal: number;
  setCrystal: (u: (c: number) => number) => void;
  party: string[];
  collection: UnitBase[];
  log: string[];
  pushLog: (s: string) => void;
}) {
  const navigate = useNavigate();

  const {
    stageIdx,
    waveIdx,
    playerUnits,
    enemyUnits,
    paused,
    setPaused,
    startBattle,
    runLoop,
    castUlt,
    result,
  } = useBattle(pushLog);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    startBattle(party, collection);
    runLoop(setCrystal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!result) return;
    setModalOpen(true);
  }, [result]);

  const stage = STAGES[stageIdx % STAGES.length];
  const pAlive = playerUnits.filter((u) => u.alive).length;
  const eAlive = enemyUnits.filter((u) => u.alive).length;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 text-zinc-200">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">⚔️ {stage.name}</h2>
          <Chip>
            웨이브 {waveIdx + 1}/{stage.waves.length}
          </Chip>
          <Chip>결정: {crystal}</Chip>
        </div>
        <button className="btn-sub" onClick={() => setPaused((p) => !p)}>
          {paused ? "재개" : "일시정지"}
        </button>
      </header>

      {/* 적이 위, 내 군단이 아래 */}
      <div className="flex flex-col gap-4">
        <SidePanel title={`왕국군 (${eAlive} 생존)`} units={enemyUnits} />
        <SidePanel
          title={`내 군단 (${pAlive} 생존)`}
          units={playerUnits}
          isPlayer
          onUlt={castUlt}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="mb-1 text-xs uppercase text-zinc-400">전투 로그</div>
        <div className="max-h-48 overflow-auto text-sm leading-relaxed">
          {log.map((l, i) => (
            <div key={i} className="text-zinc-300">
              {l}
            </div>
          ))}
        </div>
      </div>

      <ResultModal
        open={modalOpen}
        win={!!result?.win}
        crystals={result?.crystals ?? 0}
        onClose={() => {
          setModalOpen(false);
          navigate("/");
        }}
      />
    </div>
  );
}
