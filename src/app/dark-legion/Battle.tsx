import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeState } from "../../features/me/model/useMeState";
import { useStages } from "../../features/stage/model/useStage";
import { useBattleFinish } from "../../features/battle/model/useBattleFinish";
import { useBattle } from "../../features/battle/model/useBattle";
import { Chip } from "../../shared/ui/Chip";
import { SidePanel } from "../../widgets/SidePanel/SidePanel";
import ResultModal from "../../widgets/ResultModal/ResultModal";

export default function Battle() {
  const navigate = useNavigate();
  const { data: me } = useMeState();
  const { data: stages } = useStages();
  const { mutateAsync: finishBattle } = useBattleFinish();

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
  } = useBattle((msg) => console.log(msg));

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!stages || !me) return;
    const stage = stages[stageIdx % stages.length];

    const partyUnits = me.party
      .map((invId) => me.collection.find((c) => c.inventoryId === invId))
      .filter((u): u is NonNullable<typeof u> => Boolean(u));

    startBattle(partyUnits, stage);
    runLoop(stage);
  }, [stages, me]);

  useEffect(() => {
    if (!result || !stages) return;
    const stage = stages[stageIdx % stages.length];
    finishBattle({
      stageId: stage.id,
      waveIdx,
      win: !!result.win,
      drops: null,
    }).finally(() => setModalOpen(true));
  }, [result]);

  if (!stages) return <div>스테이지 불러오는 중…</div>;

  const stage = stages[stageIdx % stages.length];
  const pAlive = playerUnits.filter((u) => u.alive).length;
  const eAlive = enemyUnits.filter((u) => u.alive).length;

  return (
    <div>
      <header>
        <h2>⚔️ {stage.name}</h2>
        <Chip>
          웨이브 {waveIdx + 1}/{stage.waves.length}
        </Chip>
        <button onClick={() => setPaused((p) => !p)}>
          {paused ? "재개" : "일시정지"}
        </button>
      </header>

      <SidePanel title={`왕국군 (${eAlive})`} units={enemyUnits} />
      <SidePanel
        title={`내 군단 (${pAlive})`}
        units={playerUnits}
        isPlayer
        onUlt={castUlt}
      />

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
