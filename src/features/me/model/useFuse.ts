import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/client";

type FuseRequest = {
  targetInventoryId: string;
  materialInventoryIds: string[];
};

type FuseResponse = {
  targetInventoryId: string;
  unitId: string;
  level: number;
};

export const useFuse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FuseRequest) =>
      api.post<FuseResponse>("/fusion/merge", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "state"] }),
  });
};
