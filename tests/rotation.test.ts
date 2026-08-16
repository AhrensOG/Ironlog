import { test } from "node:test";
import assert from "node:assert/strict";
import {
  listGroup,
  resolveActiveVariant,
  type VariantGroup,
} from "../lib/rotation";

function group(mode: VariantGroup["mode"], activeId: string | null): VariantGroup {
  return {
    parent: { id: "padre", name: "Remo en barra", order: 1 },
    variants: [
      { id: "v1", name: "Remo con mancuerna", order: 2 },
      { id: "v2", name: "Remo Pendlay", order: 3 },
    ],
    mode,
    activeId,
  };
}

test("manual: respeta la variante elegida", () => {
  const r = resolveActiveVariant({
    group: group("manual", "v1"),
    week: 3,
    failures: {},
  });
  assert.equal(r.id, "v1");
});

test("manual: sin elección vuelve al padre", () => {
  const r = resolveActiveVariant({
    group: group("manual", null),
    week: 3,
    failures: {},
  });
  assert.equal(r.id, "padre");
});

test("manual: elección inválida vuelve al padre", () => {
  const r = resolveActiveVariant({
    group: group("manual", "inexistente"),
    week: 3,
    failures: {},
  });
  assert.equal(r.id, "padre");
});

test("alternarSemana: rota determinista semana a semana", () => {
  const g = group("alternarSemana", null);
  const s1 = resolveActiveVariant({ group: g, week: 1, failures: {} });
  const s2 = resolveActiveVariant({ group: g, week: 2, failures: {} });
  const s3 = resolveActiveVariant({ group: g, week: 3, failures: {} });
  const s4 = resolveActiveVariant({ group: g, week: 4, failures: {} });
  assert.equal(s1.id, "padre");
  assert.equal(s2.id, "v1");
  assert.equal(s3.id, "v2");
  assert.equal(s4.id, "padre");
});

test("porEstancamiento: mantiene la actual sin fallos", () => {
  const r = resolveActiveVariant({
    group: group("porEstancamiento", "v1"),
    week: 5,
    failures: { v1: 1 },
  });
  assert.equal(r.id, "v1");
});

test("porEstancamiento: rota a la siguiente con 2 fallos", () => {
  const r = resolveActiveVariant({
    group: group("porEstancamiento", "v1"),
    week: 5,
    failures: { v1: 2 },
  });
  assert.equal(r.id, "v2");
});

test("porEstancamiento: al fallar la última vuelve al padre", () => {
  const r = resolveActiveVariant({
    group: group("porEstancamiento", "v2"),
    week: 5,
    failures: { v2: 2 },
  });
  assert.equal(r.id, "padre");
});

test("porEstancamiento: umbral personalizado", () => {
  const r = resolveActiveVariant({
    group: group("porEstancamiento", "v1"),
    week: 5,
    failures: { v1: 3 },
    umbralFallos: 3,
  });
  assert.equal(r.id, "v2");
});

test("grupo sin variants: siempre el padre", () => {
  const g: VariantGroup = {
    parent: { id: "padre", name: "Solo", order: 1 },
    variants: [],
    mode: "alternarSemana",
    activeId: null,
  };
  const r = resolveActiveVariant({ group: g, week: 9, failures: {} });
  assert.equal(r.id, "padre");
});

test("listGroup: padre primero, luego variantes por orden", () => {
  const lista = listGroup(group("manual", null));
  assert.deepEqual(
    lista.map((v) => v.id),
    ["padre", "v1", "v2"],
  );
});
