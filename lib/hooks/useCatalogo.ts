import useSWR from "swr";
import type { WeightType } from "@/lib/models/RoutineExercise";

export interface CatalogItem {
  id: string;
  name: string;
  pattern: string;
  weightType: WeightType;
  description: string | null;
  muscleGroup: { id: string; name: string } | null;
}

export function useExerciseCatalog(grupoId?: string | null) {
  const q = grupoId ? `?muscleGroupId=${grupoId}` : "";
  return useSWR<CatalogItem[]>(`/api/exercise-catalog${q}`);
}
