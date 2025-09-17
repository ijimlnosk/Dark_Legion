import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/client";
import type { MeState } from "../../../entities/unit/model/types";

export const useMeState = () =>
  useQuery({
    queryKey: ["me", "state"],
    queryFn: () => api.get<MeState>("/me/state"),
  });

export const useUpdateParty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slots: string[]) => api.put("/me/party", { slots }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "state"] }),
  });
};

export const useAdjustCrystal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (delta: number) =>
      api.put<{ crystal: number }>("/me/crystal", { delta }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "state"] }),
  });
};
