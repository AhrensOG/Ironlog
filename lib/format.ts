import type { WeightType } from "@/lib/models/RoutineExercise";

export function formatWeight(valor: number): string {
  return valor.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

export function formatLoad(e: {
  weightType: WeightType;
  fixedBar: number | null;
  currentLoad: number;
}): string {
  if (e.currentLoad === 0) return "Corporal";
  if (e.weightType === "porLado") {
    return `${formatWeight(e.currentLoad)} kg/lado (${formatWeight(e.currentLoad * 2)} total)`;
  }
  if (e.weightType === "barraDiscos") {
    const bar = e.fixedBar ?? 0;
    return `${formatWeight(bar)} + ${formatWeight(e.currentLoad)}/lado (${formatWeight(bar + e.currentLoad * 2)} total)`;
  }
  return `${formatWeight(e.currentLoad)} kg`;
}

export function formatRange(e: { sets: number; minReps: number; maxReps: number }): string {
  if (e.minReps === e.maxReps) {
    return `${e.sets}×${e.minReps}`;
  }
  return `${e.sets}×${e.minReps}-${e.maxReps}`;
}
