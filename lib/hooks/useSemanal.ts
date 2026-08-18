import useSWR from "swr";

export interface WeeklyRecord {
  date: string;
  weight: number;
  reps: number;
  rir: number | null;
  sets: number;
  isPR: boolean;
  isInjury: boolean;
  note: string | null;
}

export interface WeeklyRow {
  exercise: string;
  group: string;
  registros: WeeklyRecord[];
  previousWeight: number | null;
}

export interface AuditRow {
  group: string;
  sets: number;
  minReps: number;
  maxReps: number;
  status: "belowMEV" | "optimal" | "aboveMRV";
}

export interface WeeklyRes {
  week: { start: string; end: string };
  routine: { id: string; name: string } | null;
  rows: WeeklyRow[];
  auditoria: AuditRow[];
  sessions: Array<{
    date: string;
    routineDay: number | null;
    isRest: boolean;
    notes: string | null;
  }>;
}

export function useSemanal(date: string) {
  const query = new URLSearchParams({ date });
  return useSWR<WeeklyRes>(`/api/summary/week?${query.toString()}`, {
    keepPreviousData: true,
  });
}
