import { z } from "zod";

export const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export function dayName(number: number): string {
  return DIAS[number - 1] ?? String(number);
}

export function dayNumber(valor: string): number | null {
  const trimmed = valor.trim().toLowerCase();
  const idx = DIAS.findIndex((d) => d.toLowerCase() === trimmed);
  if (idx >= 0) return idx + 1;
  const num = Number(trimmed);
  if (Number.isInteger(num) && num >= 1 && num <= 7) return num;
  return null;
}

// ─── Parser CSV ───

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === "," || c === ";") {
      out.push(field);
      field = "";
    } else {
      field += c;
    }
  }
  out.push(field);
  return out;
}

export function parseDelimited(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map(parseCsvLine);
}

const numOrUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const csvRowSchema = z.object({
  day: z.string().min(1),
  exercise: z.string().min(1).trim(),
  sets: z.coerce.number().int().min(1),
  minReps: z.coerce.number().int().min(1),
  maxReps: z.coerce.number().int().min(1),
  weightType: z
    .preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? "total" : v),
      z.enum(["total", "porLado", "barraDiscos"]),
    )
    .catch("total"),
  fixedBar: z.preprocess(
    numOrUndefined,
    z.coerce.number().min(0).nullable().optional(),
  ),
  load: z.coerce.number().min(0),
  increment: z.coerce.number().min(0),
  rir: z.coerce.number().int().min(0),
  muscleGroup: z.string().min(1).trim(),
  order: z.preprocess(
    numOrUndefined,
    z.coerce.number().int().min(1).optional(),
  ),
  variantOf: z
    .preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().trim().optional()),
  rotation: z
    .preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.enum(["manual", "alternarSemana", "porEstancamiento"]).optional()),
});

export interface RoutineCsvRow {
  day: number;
  exercise: string;
  sets: number;
  minReps: number;
  maxReps: number;
  weightType: "total" | "porLado" | "barraDiscos";
  fixedBar: number | null;
  load: number;
  increment: number;
  rir: number;
  muscleGroup: string;
  order: number;
  variantOf?: string;
  rotation?: "manual" | "alternarSemana" | "porEstancamiento";
}

const HEADER_ESPERADO = [
  "dia",
  "ejercicio",
  "series",
  "rangomin",
  "rangomax",
  "tipopeso",
  "barrafija",
  "carga",
  "incremento",
  "rir",
  "grupomuscular",
  "orden",
  "variante_de",
  "rotacion",
];

const CAMPOS_FILA = [
  "day",
  "exercise",
  "sets",
  "minReps",
  "maxReps",
  "weightType",
  "fixedBar",
  "load",
  "increment",
  "rir",
  "muscleGroup",
  "order",
  "variantOf",
  "rotation",
];

/**
 * Convierte un CSV de rutina en rows validadas. Devuelve errors por fila
 * (número de línea + mensaje) sin lanzar.
 */
export function parseRoutineCsv(
  text: string,
): { rows: RoutineCsvRow[]; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseDelimited(text);

  if (parsed.length === 0) {
    return { rows: [], errors: ["El archivo está vacío."] };
  }

  const header = parsed[0].map((h) => h.trim().toLowerCase().replace(/\s/g, ""));
  const esperado = HEADER_ESPERADO;
  const base = esperado.slice(0, 12);
  const ok = base.every((col, i) => header[i] === col);
  if (!ok) {
    return {
      rows: [],
      errors: [
        `Encabezado no reconocido. Esperado: ${HEADER_ESPERADO.join(", ")}`,
      ],
    };
  }

  const rows: RoutineCsvRow[] = [];

  parsed.slice(1).forEach((row, idx) => {
    const numeroLinea = idx + 2;
    const raw = Object.fromEntries(
      CAMPOS_FILA.map((col, i) => [col, row[i] ?? ""]),
    );

    const day = dayNumber(String(raw.day ?? ""));
    if (day == null) {
      errors.push(`Línea ${numeroLinea}: día inválido "${raw.day}".`);
      return;
    }

    const result = csvRowSchema.safeParse(raw);
    if (!result.success) {
      const detalles = result.error.flatten().fieldErrors;
      for (const [campo, msgs] of Object.entries(detalles)) {
        errors.push(
          `Línea ${numeroLinea}: ${campo} ${(msgs ?? []).join(", ")}.`,
        );
      }
      return;
    }

    const d = result.data;
    if (d.minReps > d.maxReps) {
      errors.push(
        `Línea ${numeroLinea}: minReps (${d.minReps}) mayor que maxReps (${d.maxReps}).`,
      );
      return;
    }

    rows.push({ day,
      exercise: d.exercise,
      sets: d.sets,
      minReps: d.minReps,
      maxReps: d.maxReps,
      weightType: d.weightType,
      fixedBar: d.fixedBar ?? null,
      load: d.load,
      increment: d.increment,
      rir: d.rir,
      muscleGroup: d.muscleGroup,
      order: d.order ?? rows.length + 1,
      variantOf: d.variantOf,
      rotation: d.rotation,
    });
  });

  return { rows, errors };
}

// ─── Export CSV ───

export interface ExerciseForCsv {
  id: string;
  weekday: number;
  name: string;
  sets: number;
  minReps: number;
  maxReps: number;
  weightType: string;
  fixedBar: number | null;
  currentLoad: number;
  equipmentIncrement: number;
  baseRir: number;
  muscleGroup: string;
  order: number;
  variantOfId: string | null;
  rotationMode: string;
}

function escapeCsv(value: string): string {
  if (/[;"\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function routineToCsv(exercises: ExerciseForCsv[]): string {
  const header = [
    "dia",
    "ejercicio",
    "series",
    "rangoMin",
    "rangoMax",
    "tipoPeso",
    "barraFija",
    "carga",
    "incremento",
    "rir",
    "grupomuscular",
    "orden",
    "variante_de",
    "rotacion",
  ];

  const nameById = new Map(exercises.map((e) => [e.id as string, e.name]));

  const sorted = [...exercises].sort(
    (a, b) => a.weekday - b.weekday || a.order - b.order,
  );

  const rows: string[][] = sorted.map((e) => [
    dayName(e.weekday),
    e.name,
    String(e.sets),
    String(e.minReps),
    String(e.maxReps),
    e.weightType,
    e.fixedBar == null ? "" : String(e.fixedBar),
    String(e.currentLoad),
    String(e.equipmentIncrement),
    String(e.baseRir),
    e.muscleGroup,
    String(e.order),
    e.variantOfId ? (nameById.get(e.variantOfId) ?? "") : "",
    e.variantOfId ? "" : e.rotationMode,
  ]);

  return [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
