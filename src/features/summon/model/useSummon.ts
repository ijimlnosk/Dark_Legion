import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OwnedUnit } from "../../../entities/unit/model/types";
import { api } from "../../../shared/api/client";

type SummonResponse = { crystal: number; unit: OwnedUnit };

export const useSummonOne = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<SummonResponse>("/summon/one"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "state"] }),
  });
};
