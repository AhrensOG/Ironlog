/**
 * Funciones de fechas seguras respecto a zona horaria.
 * Las fechas se tratan como "solo fecha" (sin hora) y se parsean/formatean
 * siempre en UTC para evitar desfases al estar el servidor en zonas UTC+.
 */

function parseFecha(date: string): Date {
  return new Date(`${ date }T00:00:00Z`);
}

function fmtFecha(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function isoWeekday(date: string): number {
  const day = parseFecha(date).getUTCDay();
  return ((day + 6) % 7) + 1;
}

export function weekRange(date: string): { start: string; end: string } {
  const d = parseFecha(date);
  const diffMonday = (d.getUTCDay() + 6) % 7;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - diffMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { start: fmtFecha(monday), end: fmtFecha(sunday) };
}

export function addDays(date: string, days: number): string {
  const d = parseFecha(date);
  d.setUTCDate(d.getUTCDate() + days);
  return fmtFecha(d);
}

/** Fecha de today en la zona horaria local del servidor (no UTC). */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
