import { test } from "node:test";
import assert from "node:assert/strict";
import { addDays, isoWeekday, weekRange } from "../lib/dates";

test("weekRange: miércoles cae dentro de lunes-domingo de su semana", () => {
  // 2026-08-12 es miércoles.
  const { start, end } = weekRange("2026-08-12");
  assert.equal(start, "2026-08-10");
  assert.equal(end, "2026-08-16");
});

test("weekRange: lunes devuelve la semana exacta", () => {
  const { start, end } = weekRange("2026-08-10");
  assert.equal(start, "2026-08-10");
  assert.equal(end, "2026-08-16");
});

test("weekRange: domingo devuelve el mismo domingo como fin", () => {
  const { start, end } = weekRange("2026-08-16");
  assert.equal(start, "2026-08-10");
  assert.equal(end, "2026-08-16");
});

test("isoWeekday: 1 = Lunes ... 7 = Domingo", () => {
  assert.equal(isoWeekday("2026-08-10"), 1);
  assert.equal(isoWeekday("2026-08-12"), 3);
  assert.equal(isoWeekday("2026-08-16"), 7);
});

test("addDays: suma y cruza meses", () => {
  assert.equal(addDays("2026-08-12", 7), "2026-08-19");
  assert.equal(addDays("2026-08-30", 3), "2026-09-02");
  assert.equal(addDays("2026-08-12", -7), "2026-08-05");
});
