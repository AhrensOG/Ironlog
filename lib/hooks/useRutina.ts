import useSWR from "swr";
import type { WeightType } from "@/lib/models/RoutineExercise";

export interface RoutineSummary {
  id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  exercises: number;
  logs: number;
  methodConfig: { id: string; name: string } | null;
}

export interface MuscleGroupRes {
  id: string;
  name: string;
  minReps: number;
  maxReps: number;
  order: number;
}

export interface ExerciseRes {
  id: string;
  weekday: number;
  name: string;
  order: number;
  sets: number;
  minReps: number;
  maxReps: number;
  weightType: WeightType;
  fixedBar: number | null;
  currentLoad: number;
  equipmentIncrement: number;
  baseRir: number;
  variantOfId: string | null;
  rotationMode: "manual" | "alternarSemana" | "porEstancamiento";
  activeVariantId: string | null;
  muscleGroup: { id: string; name: string } | null;
}

export interface MethodConfigRes {
  id: string;
  name: string;
  blockLength: number;
  rirPerWeek: number[];
  deloadVolumePct: number;
  failureRules: { semanasFalloSeguidas: number; ajustePct: number };
  progressionStyle: string;
}

export interface RoutineDetail {
  id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  methodConfig: MethodConfigRes | null;
  exercises: ExerciseRes[];
}

export function useRoutines() {
  return useSWR<RoutineSummary[]>("/api/routines");
}

export function useRoutineDetail(id: string | null) {
  return useSWR<RoutineDetail>(id ? `/api/routines/${id}` : null);
}

export function useMuscleGroups() {
  return useSWR<MuscleGroupRes[]>("/api/muscle-groups");
}
