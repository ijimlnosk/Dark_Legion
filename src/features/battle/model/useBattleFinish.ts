import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/client";

type FinishReq = {
  stageId: string;
  waveIdx: number;
  win: boolean;
  drops?: unknown;
};
type FinishRes = { crystal: number; crystalsAwarded: number; log: unknown };

export const useBattleFinish = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FinishReq) =>
      api.post<FinishRes>("/battles/finish", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "state"] }),
  });
};
