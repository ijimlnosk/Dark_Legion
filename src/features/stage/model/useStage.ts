import { useQuery } from "@tanstack/react-query";

import type { UnitBase } from "../../../entities/unit/model/types";
import { api } from "../../../shared/api/client";

export type Stage = {
  id: string;
  name: string;
  waves: string[][];
  rewardCrystals: number;
};
export const useStages = () =>
  useQuery({
    queryKey: ["stages"],
    queryFn: () => api.get<Stage[]>("/catalog/stages"),
    staleTime: 300000,
  });

export const useCatalog = () =>
  useQuery({
    queryKey: ["catalog"],
    queryFn: () => api.get<UnitBase[]>("/catalog/units"),
    staleTime: 300000,
  });
