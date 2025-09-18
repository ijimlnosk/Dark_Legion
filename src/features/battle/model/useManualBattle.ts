import { useCallback, useMemo, useState } from "react";
import { api } from "../../../shared/api/client";

type UnitVM = {
  id: string;
  name: string;
  side: "ALLY" | "ENEMY";
  hpMax: number;
  hp: number;
  atk: number;
  speed: number;
  alive: boolean;
};

type StartRes = {
  sessionId: string;
  order: string[];
  units: Record<string, UnitVM>;
};

type ActReq = {
  sessionId: string;
  action: { type: "ATTACK" | "ULT"; actorId: string; targetId: string };
};

type ActRes = {
  logs: string[];
  deadIds: string[];
  nextTurnIdx: number;
  finished: boolean;
  winner: "ALLY" | "ENEMY" | null;
  units: Record<string, UnitVM>;
  order: string[];
};

export const useManualBattle = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [units, setUnits] = useState<Record<string, UnitVM>>({});
  const [turnIdx, setTurnIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<"ALLY" | "ENEMY" | null>(null);
  const [loading, setLoading] = useState(false);

  const currentActorId = order[turnIdx];
  const currentActor = currentActorId ? units[currentActorId] : undefined;

  const allies = useMemo(
    () => Object.values(units).filter((u) => u.side === "ALLY"),
    [units]
  );
  const enemies = useMemo(
    () => Object.values(units).filter((u) => u.side === "ENEMY"),
    [units]
  );

  const start = useCallback(async (stageId: string, waveIdx = 0) => {
    setLoading(true);
    try {
      const r = await api.post<StartRes>("/battles/manual/start", {
        stageId,
        waveIdx,
      });
      setSessionId(r.sessionId);
      setOrder(r.order);
      setUnits(r.units);
      setTurnIdx(0);
      setLogs([]);
      setFinished(false);
      setWinner(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const act = useCallback(
    async (type: "ATTACK" | "ULT", targetId: string) => {
      if (!sessionId || finished || !currentActorId) return;
      setLoading(true);
      try {
        const body: ActReq = {
          sessionId,
          action: { type, actorId: currentActorId, targetId },
        };
        const r = await api.post<ActRes>("/battles/manual/act", body);
        if (r.logs?.length) setLogs((prev) => [...prev, ...r.logs]);
        setUnits(r.units);
        setOrder(r.order);
        setTurnIdx(r.nextTurnIdx ?? 0);
        setFinished(r.finished);
        setWinner(r.winner ?? null);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, finished, currentActorId]
  );

  return {
    // state
    sessionId,
    order,
    units,
    turnIdx,
    logs,
    finished,
    winner,
    loading,
    currentActorId,
    currentActor,
    allies,
    enemies,
    // actions
    start,
    act,
  } as const;
};
