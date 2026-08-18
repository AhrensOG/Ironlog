import useSWR from "swr";
import type { WeightType } from "@/lib/models/RoutineExercise";

export interface SuggestionRes {
  action:
    | "increaseWeight"
    | "addReps"
    | "doubleJump"
    | "keep"
    | "reduceWeight"
    | "protectInjury"
    | "deload";
  weight: number;
  reps: number;
  reason: string;
}

export interface TodayLogRes {
  id: string;
  actualWeight: number;
  setsDone: number;
  actualReps: number;
  rir: number | null;
  isPR: boolean;
  isInjury: boolean;
  note: string | null;
}

export interface TodayExerciseRes {
  id: string;
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
  muscleGroup: { id: string; name: string } | null;
  last: { date: string; actualWeight: number; actualReps: number; rir: number | null } | null;
  amrap: {
    week6Weight: number;
    saved: { weight: number; reps: number; e1rm: number } | null;
  } | null;
  suggestion: SuggestionRes;
  group: {
    mode: "manual" | "alternarSemana" | "porEstancamiento";
    parentId: string;
    variants: Array<{ id: string; name: string }>;
    activeId: string;
    isParent: boolean;
  } | null;
  todayLog: TodayLogRes | null;
}

export interface TodayRes {
  date: string;
  routineDay: number;
  routine: { id: string; name: string } | null;
  block: {
    id: string | null;
    week: number;
    targetRir: number | null;
    isDeload: boolean;
    deloadPassed: boolean;
    blockLength: number;
  } | null;
  session: { id: string; isRest: boolean; notes: string | null; routineDay: number | null } | null;
  exercises: TodayExerciseRes[];
}

export function useToday(date: string, routineDay: number | null) {
  const query = new URLSearchParams({ date });
  if (routineDay) query.set("routineDay", String(routineDay));
  const key = `/api/session/today?${query.toString()}`;
  return useSWR<TodayRes>(key, { keepPreviousData: true });
}
