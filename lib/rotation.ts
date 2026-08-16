import type { RotationMode } from "@/lib/models/RoutineExercise";

/**
 * Resolución de la variante isActive de un group de exercises equivalentes.
 * Cada variante conserva su propia progresión e historial; el group solo
 * decide cuál se entrena today.
 */

export interface VariantSummary {
  id: string;
  name: string;
  order: number;
}

export interface VariantGroup {
  parent: VariantSummary;
  variants: VariantSummary[];
  mode: RotationMode;
  activeId: string | null;
}

export interface FailureHistory {
  [exerciseId: string]: number;
}

export function listGroup(group: VariantGroup): VariantSummary[] {
  return [group.parent, ...group.variants].sort((a, b) => a.order - b.order);
}

/**
 * Devuelve el id de la variante isActive según el mode de rotación.
 * - manual: la elegida por el usuario (o el parent si no hay elección).
 * - alternarSemana: rota cada week de forma determinista.
 * - porEstancamiento: mantiene la actual; rota a la siguiente solo cuando
 *   la actual acumula `umbralFallos` semanas de fallo (por defecto 2).
 */
export function resolveActiveVariant(params: {
  group: VariantGroup;
  week: number;
  failures: FailureHistory;
  umbralFallos?: number;
}): VariantSummary {
  const { group, week, failures } = params;
  const umbral = params.umbralFallos ?? 2;
  const lista = listGroup(group);

  if (lista.length <= 1) return lista[0];

  const indiceDe = (id: string | null) => {
    const idx = lista.findIndex((v) => v.id === id);
    return idx >= 0 ? idx : 0;
  };

  if (group.mode === "alternarSemana") {
    return lista[(week - 1) % lista.length];
  }

  if (group.mode === "porEstancamiento") {
    const actual = indiceDe(group.activeId);
    const fallosActual = failures[lista[actual].id] ?? 0;
    if (fallosActual >= umbral) {
      return lista[(actual + 1) % lista.length];
    }
    return lista[actual];
  }

  // manual
  return lista[indiceDe(group.activeId)];
}
