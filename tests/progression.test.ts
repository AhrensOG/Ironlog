import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countConsecutiveFails,
  epley1RM,
  getBlockWeek,
  roundToIncrement,
  suggestDeload,
  suggestNext,
  type ExerciseForProgression,
  type LastLog,
} from "../lib/progression";

function ej(overrides: Partial<ExerciseForProgression> = {}): ExerciseForProgression {
  return {
    id: "ex-1",
    name: "Test",
    minReps: 8,
    maxReps: 10,
    weightType: "total",
    fixedBar: null,
    equipmentIncrement: 5,
    currentLoad: 62,
    ...overrides,
  };
}

function log(overrides: Partial<LastLog> = {}): LastLog {
  return {
    date: "2026-08-14",
    actualWeight: 62,
    actualReps: 10,
    rir: 2,
    isInjury: false,
    ...overrides,
  };
}

test("polea 5 kg: tope del rango con RIR ok → subir un salto de equipo", () => {
  const s = suggestNext({ exercise: ej(), last: log(), targetRir: 2 });
  assert.equal(s.action, "increaseWeight");
  assert.equal(s.weight, 67);
  assert.equal(s.reps, 8);
});

test("dentro del rango con RIR en objetivo → +1 rep, mismo peso", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 9, rir: 2 }),
    targetRir: 2,
  });
  assert.equal(s.action, "addReps");
  assert.equal(s.weight, 62);
  assert.equal(s.reps, 10);
});

test("tope del rango con RIR 2+ sobre objetivo → salto doble", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 10, rir: 4 }),
    targetRir: 2,
  });
  assert.equal(s.action, "doubleJump");
  assert.equal(s.weight, 72);
  assert.equal(s.reps, 8);
});

test("fallo de reps mínimas → mantener carga", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 7, rir: 0 }),
    targetRir: 2,
  });
  assert.equal(s.action, "keep");
  assert.equal(s.weight, 62);
  assert.equal(s.reps, 8);
});

test("2 fallos consecutivos → bajar un salto de equipo", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 7, rir: 0 }),
    targetRir: 2,
    consecutiveFails: 2,
  });
  assert.equal(s.action, "reduceWeight");
  assert.equal(s.weight, 57);
  assert.equal(s.reps, 8);
});

test("flag de lesión → nunca subir", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 10, rir: 1, isInjury: true }),
    targetRir: 2,
    consecutiveFails: 3,
  });
  assert.equal(s.action, "protectInjury");
  assert.equal(s.weight, 62);
});

test("incremento 0 (weight corporal) → progresión por reps más allá del rango", () => {
  const s = suggestNext({
    exercise: ej({ equipmentIncrement: 0, currentLoad: 0, minReps: 10, maxReps: 15 }),
    last: log({ actualWeight: 0, actualReps: 15, rir: 2 }),
    targetRir: 3,
  });
  assert.equal(s.action, "addReps");
  assert.equal(s.reps, 17);
});

test("mancuernas por lado: incremento se aplica por lado", () => {
  const s = suggestNext({
    exercise: ej({ weightType: "porLado", equipmentIncrement: 2, currentLoad: 20 }),
    last: log({ actualWeight: 20, actualReps: 10, rir: 1 }),
    targetRir: 2,
  });
  assert.equal(s.action, "increaseWeight");
  assert.equal(s.weight, 22);
});

test("Smith barra + discos: incremento por lado", () => {
  const s = suggestNext({
    exercise: ej({ weightType: "barraDiscos", fixedBar: 20, equipmentIncrement: 1.25, currentLoad: 32.5, minReps: 8, maxReps: 8 }),
    last: log({ actualWeight: 32.5, actualReps: 8, rir: 2 }),
    targetRir: 2,
  });
  assert.equal(s.action, "increaseWeight");
  assert.equal(s.weight, 33.75);
});

test("sin registros previos → carga planificada", () => {
  const s = suggestNext({ exercise: ej(), last: null, targetRir: 2 });
  assert.equal(s.action, "keep");
  assert.equal(s.weight, 62);
  assert.equal(s.reps, 8);
});

test("RIR 0 dentro del rango → consolidar (mantener reps)", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 9, rir: 0 }),
    targetRir: 2,
  });
  assert.equal(s.action, "keep");
  assert.equal(s.reps, 9);
});

test("RIR sin dato → progresión conservadora por reps", () => {
  const s = suggestNext({
    exercise: ej(),
    last: log({ actualReps: 9, rir: null }),
    targetRir: 2,
  });
  assert.equal(s.action, "addReps");
  assert.equal(s.weight, 62);
});

test("countConsecutiveFails: cuenta desde el último registro", () => {
  const history: LastLog[] = [
    log({ date: "2026-08-07", actualReps: 7 }),
    log({ date: "2026-08-14", actualReps: 6 }),
  ];
  assert.equal(countConsecutiveFails(history, 8), 2);

  const history2: LastLog[] = [
    log({ date: "2026-08-14", actualReps: 10 }),
    log({ date: "2026-08-07", actualReps: 7 }),
  ];
  assert.equal(countConsecutiveFails(history2, 8), 0);
});

test("getBlockWeek: RIR por semana y descarga", () => {
  const base = { startDate: "2026-08-03", blockLength: 6, rirPerWeek: [3, 3, 2, 2, 1, 1] };

  const w1 = getBlockWeek({ ...base, date: "2026-08-03" });
  assert.deepEqual(w1, { week: 1, targetRir: 3, isDeload: false });

  const w5 = getBlockWeek({ ...base, date: "2026-09-03" });
  assert.equal(w5.week, 5);
  assert.equal(w5.targetRir, 1);

  const w7 = getBlockWeek({ ...base, date: "2026-09-14" });
  assert.equal(w7.week, 7);
  assert.equal(w7.targetRir, null);
  assert.equal(w7.isDeload, true);
});

test("epley1RM: 70 kg × 6 = 84", () => {
  assert.equal(epley1RM(70, 6), 84);
});

test("suggestDeload: 60% redondeado al incremento", () => {
  assert.equal(suggestDeload(100, 0.6, 2.5), 60);
  assert.equal(suggestDeload(62, 0.6, 5), 35);
});

test("roundToIncrement redondea al salto disponible", () => {
  assert.equal(roundToIncrement(63.7, 5), 65);
  assert.equal(roundToIncrement(33.75, 1.25), 33.75);
});
