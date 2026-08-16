import useSWR from "swr";

export interface AmrapRes {
  id: string;
  routineExerciseId: string;
  name: string;
  weight: number;
  reps: number;
  e1rm: number;
}

export interface BlockExerciseRes {
  id: string;
  name: string;
  weekday: number;
  currentLoad: number;
  muscleGroup: { name: string } | null;
}

export interface BlockRes {
  routine: { id: string; name: string } | null;
  block: {
    id: string;
    number: number;
    startDate: string;
    week: number;
    targetRir: number | null;
    isDeload: boolean;
    deloadPassed: boolean;
    blockLength: number;
    rirPerWeek: number[];
  } | null;
  amraps: AmrapRes[];
  exercises: BlockExerciseRes[];
}

export function useBloque() {
  return useSWR<BlockRes>("/api/blocks/current");
}
