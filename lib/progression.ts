import type { WeightType } from "@/lib/models/RoutineExercise";

/**
 * Autoregulated progression engine, based on the evidence-based routine
 * framework (double progression + periodized RIR).
 *
 * Rules:
 * 1. Injury flag → never increase.
 * 2. Top of the rep range + RIR ≤ target → increase one equipment step
 *    and go back to the bottom of the range.
 * 3. Inside the range + RIR ≤ target → keep weight, +1 rep.
 * 4. Logged RIR ≥ target + 2 (felt easy) → double jump (or +2 reps).
 * 5. Missed minimum reps → keep; 2 consecutive weeks → reduce.
 * 6. Exercises without load available (increment 0) → rep progression.
 */

export interface ExerciseForProgression {
  id: string;
  name: string;
  minReps: number;
  maxReps: number;
  weightType: WeightType;
  fixedBar: number | null;
  equipmentIncrement: number;
  currentLoad: number;
}

export interface LastLog {
  date: string;
  actualWeight: number;
  actualReps: number;
  rir: number | null;
  isInjury: boolean;
}

export type SuggestionAction =
  | "increaseWeight"
  | "addReps"
  | "doubleJump"
  | "keep"
  | "reduceWeight"
  | "protectInjury";

export interface Suggestion {
  action: SuggestionAction;
  weight: number;
  reps: number;
  reason: string;
  consecutiveFails: number;
}

/** Rounds a value to the nearest equipment increment. */
export function roundToIncrement(value: number, increment: number): number {
  if (increment <= 0) return Math.round(value * 100) / 100;
  const times = Math.round(value / increment);
  return Math.round(times * increment * 100) / 100;
}

/** Estimated 1RM using Epley's formula: 1RM ≈ weight × (1 + reps/30). */
export function epley1RM(weight: number, reps: number): number {
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export interface BlockWeek {
  week: number;
  targetRir: number | null;
  isDeload: boolean;
}

/**
 * Computes the block week for a given date and its RIR target.
 * Week `blockLength + 1` is the deload week (RIR target null).
 */
export function getBlockWeek(params: {
  startDate: string;
  date: string;
  blockLength: number;
  rirPerWeek: number[];
}): BlockWeek {
  const start = new Date(`${params.startDate}T00:00:00`);
  const day = new Date(`${params.date}T00:00:00`);
  const days = Math.floor((day.getTime() - start.getTime()) / 86400000);
  const week = Math.max(1, Math.floor(days / 7) + 1);

  if (week > params.blockLength) {
    return { week, targetRir: null, isDeload: true };
  }

  const targetRir =
    params.rirPerWeek[week - 1] ??
    params.rirPerWeek[params.rirPerWeek.length - 1] ??
    2;

  return { week, targetRir, isDeload: false };
}

/**
 * Counts consecutive failures (latest logs below the minimum reps),
 * starting from the most recent record.
 */
export function countConsecutiveFails(
  history: LastLog[],
  minReps: number,
): number {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let failures = 0;
  for (const log of sorted) {
    if (log.actualReps < minReps) {
      failures++;
    } else {
      break;
    }
  }
  return failures;
}

/** Load suggestion for the deload week (reduced volume). */
export function suggestDeload(load: number, pct: number, increment: number): number {
  return roundToIncrement(load * pct, increment);
}

/**
 * Next-session suggestion for an exercise based on its latest record.
 * The returned weight uses the same unit as the exercise `currentLoad`
 * (total, per side, or plates per side).
 */
export function suggestNext(params: {
  exercise: ExerciseForProgression;
  last: LastLog | null;
  targetRir: number;
  consecutiveFails?: number;
}): Suggestion {
  const { exercise: ex, last, targetRir, consecutiveFails = 0 } = params;

  const inc = ex.equipmentIncrement > 0 ? ex.equipmentIncrement : null;

  if (!last) {
    return {
      action: "keep",
      weight: ex.currentLoad,
      reps: ex.minReps,
      reason: "Sin registros previos: usa la carga planificada.",
      consecutiveFails: 0,
    };
  }

  if (last.isInjury) {
    return {
      action: "protectInjury",
      weight: last.actualWeight,
      reps: ex.minReps,
      reason: "Marcaste molestia/lesión: no se sugiere subir. Prioriza la técnica.",
      consecutiveFails,
    };
  }

  if (consecutiveFails >= 2) {
    const reduction = inc ?? roundToIncrement(ex.currentLoad * 0.05, 2.5);
    return {
      action: "reduceWeight",
      weight: Math.max(0, last.actualWeight - reduction),
      reps: ex.minReps,
      reason: `${consecutiveFails} semanas sin completar el mínimo: descarga un salto de equipo (o 5%) y reconstruye.`,
      consecutiveFails,
    };
  }

  const reps = last.actualReps;
  const rir = last.rir;

  // Missed the minimum reps → keep and retry.
  if (reps < ex.minReps) {
    return {
      action: "keep",
      weight: last.actualWeight,
      reps: ex.minReps,
      reason: `No completaste el mínimo (${reps} < ${ex.minReps}): mantén la carga e inténtalo de nuevo.`,
      consecutiveFails,
    };
  }

  const atTop = reps >= ex.maxReps;
  const feltEasy = rir != null && rir >= targetRir + 2;

  if (atTop && feltEasy) {
    if (inc) {
      return {
        action: "doubleJump",
        weight: last.actualWeight + 2 * inc,
        reps: ex.minReps,
        reason: `Tope del rango con RIR ${rir} (objetivo ${targetRir}): se sintió fácil, salta dos incrementos de equipo.`,
        consecutiveFails,
      };
    }
    return {
      action: "addReps",
      weight: last.actualWeight,
      reps: reps + 2,
      reason: `Tope del rango con RIR ${rir} y sin carga para subir: aumenta repeticiones.`,
      consecutiveFails,
    };
  }

  if (atTop) {
    if (inc) {
      return {
        action: "increaseWeight",
        weight: last.actualWeight + inc,
        reps: ex.minReps,
        reason: `Tope del rango con esfuerzo adecuado (RIR ${rir ?? "?"}): sube un salto de equipo y vuelve al mínimo del rango.`,
        consecutiveFails,
      };
    }
    return {
      action: "addReps",
      weight: last.actualWeight,
      reps: reps + 2,
      reason: `Tope del rango sin carga para subir: aumenta repeticiones.`,
      consecutiveFails,
    };
  }

  // Inside the range.
  if (rir != null && rir <= targetRir) {
    if (rir <= 0) {
      return {
        action: "keep",
        weight: last.actualWeight,
        reps,
        reason: `Llegaste al fallo (RIR 0) dentro del rango: mantén reps y carga para consolidar.`,
        consecutiveFails,
      };
    }
    return {
      action: "addReps",
      weight: last.actualWeight,
      reps: Math.min(reps + 1, ex.maxReps),
      reason: `Esfuerzo en objetivo (RIR ${rir}): mantén el peso y suma una repetición.`,
      consecutiveFails,
    };
  }

  if (feltEasy) {
    return {
      action: "addReps",
      weight: last.actualWeight,
      reps: Math.min(reps + 2, ex.maxReps),
      reason: `Se sintió fácil (RIR ${rir}): suma dos repeticiones con el mismo peso.`,
      consecutiveFails,
    };
  }

  // No RIR logged or slightly easy: conservative rep progression.
  return {
    action: "addReps",
    weight: last.actualWeight,
    reps: Math.min(reps + 1, ex.maxReps),
    reason:
      rir == null
        ? "Sin RIR registrado: mantén el peso y suma una repetición."
        : `RIR ${rir} (objetivo ${targetRir}): mantén el peso y suma una repetición.`,
    consecutiveFails,
  };
}
