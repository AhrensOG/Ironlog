import useSWR from "swr";

export interface ProgressPoint {
  date: string;
  weight: number;
  reps: number;
  rir: number | null;
  e1rm: number;
  isPR: boolean;
  isInjury: boolean;
}

export interface ProgressExercise {
  id: string;
  name: string;
  group: string;
  registros: number;
  last: { date: string; weight: number; reps: number } | null;
}

export interface ProgressSummary {
  prs: Array<{ id: string; date: string; exercise: string; weight: number; reps: number }>;
  exercises: ProgressExercise[];
}

export interface ProgressDetail {
  exercise: {
    id: string;
    name: string;
    group: string;
    minReps: number;
    maxReps: number;
    equipmentIncrement: number;
  } | null;
  serie: ProgressPoint[];
}

export interface BodyWeightRes {
  id: string;
  date: string;
  weight: number;
}

export interface EventRes {
  id: string;
  date: string;
  type: string;
  note: string | null;
}

export function useProgressSummary() {
  return useSWR<ProgressSummary>("/api/progress");
}

export function useProgressDetail(exerciseId: string | null) {
  return useSWR<ProgressDetail>(
    exerciseId ? `/api/progress?exerciseId=${exerciseId}` : null,
  );
}

export function useBodyWeight() {
  return useSWR<BodyWeightRes[]>("/api/body-weight");
}

export function useEventos() {
  return useSWR<EventRes[]>("/api/events");
}
