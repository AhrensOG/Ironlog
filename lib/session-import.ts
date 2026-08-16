import { z } from "zod";
import { parseDelimited } from "./csv";
import {
  Routine,
  RoutineExercise,
  Session,
  SessionLog,
  TrainingBlock,
} from "./models";

export interface HistoryRow {
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  rir: number | null;
  note: string | null;
}

const EXPECTED_HEADER = ["fecha", "ejercicio", "series", "reps", "peso", "rir", "nota"];

const ROW_FIELDS = ["date", "exercise", "sets", "reps", "weight", "rir", "note"];

const filaSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  exercise: z.string().min(1).trim(),
  sets: z.coerce.number().int().min(0),
  reps: z.coerce.number().int().min(0),
  weight: z.coerce.number().min(0),
  rir: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.number().int().min(0).max(5).nullable().optional(),
  ),
  note: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().nullable().optional(),
  ),
});

export function parseHistoryCsv(
  text: string,
): { rows: HistoryRow[]; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseDelimited(text);

  if (parsed.length === 0) {
    return { rows: [], errors: ["El archivo está vacío."] };
  }

  const header = parsed[0].map((h) => h.trim().toLowerCase());
  if (!EXPECTED_HEADER.every((col, i) => header[i] === col)) {
    return {
      rows: [],
      errors: [`Encabezado no reconocido. Esperado: ${EXPECTED_HEADER.join(", ")}`],
    };
  }

  const rows: HistoryRow[] = [];

  parsed.slice(1).forEach((row, idx) => {
    const numeroLinea = idx + 2;
    const raw = Object.fromEntries(
      ROW_FIELDS.map((col, i) => [col, row[i] ?? ""]),
    );

    const result = filaSchema.safeParse(raw);
    if (!result.success) {
      const detalles = result.error.flatten().fieldErrors;
      for (const [campo, msgs] of Object.entries(detalles)) {
        errors.push(`Línea ${numeroLinea}: ${campo} ${(msgs ?? []).join(", ")}.`);
      }
      return;
    }

    const d = result.data;
    rows.push({
      date: d.date,
      exercise: d.exercise,
      sets: d.sets,
      reps: d.reps,
      weight: d.weight,
      rir: d.rir ?? null,
      note: d.note ?? null,
    });
  });

  return { rows, errors };
}

/**
 * Importa un CSV de historial (date, ejercicio, sets, reps, weight, rir, note)
 * en la rutina isActive del usuario. Mapea exercises por name, crea sessions
 * por date y detecta PRs en order cronológico. Idempotente (re-importar
 * actualiza los registros existentes).
 */
export async function importHistory(params: {
  userId: string;
  csv: string;
}): Promise<{ sessions: number; imported: number; warnings: string[] }> {
  const { userId, csv } = params;
  const { rows, errors } = parseHistoryCsv(csv);
  const warnings = [...errors];

  const routine = await Routine.findOne({ where: { userId, isActive: true } });
  if (!routine) {
    return { sessions: 0, imported: 0, warnings: ["No hay rutina activa."] };
  }

  const exercises = await RoutineExercise.findAll({
    where: { routineId: routine.id },
  });
  const porNombre = new Map(exercises.map((e) => [e.name, e]));

  const block = await TrainingBlock.findOne({
    where: { routineId: routine.id, status: "active" },
  });

  const ordenadas = [...rows].sort((a, b) => a.date.localeCompare(b.date));

  const maxPeso = new Map<string, number>();
  const sessionsSet = new Set<string>();
  let imported = 0;

  for (const f of ordenadas) {
    const ex = porNombre.get(f.exercise);
    if (!ex) {
      warnings.push(
        `Ejercicio no encontrado en la rutina isActive: "${f.exercise}" (${f.date})`,
      );
      continue;
    }

    const [session] = await Session.findOrCreate({
      where: { userId, date: f.date },
      defaults: {
        userId,
        date: f.date,
        trainingBlockId:
          block && f.date >= block.startDate ? block.id : null,
        routineDay: ex.weekday,
        isRest: false,
      },
    });

    if (session.routineDay == null) {
      session.set("routineDay", ex.weekday);
      await session.save();
    }
    sessionsSet.add(f.date);

    const tieneAnterior = maxPeso.has(ex.id);
    const prev = maxPeso.get(ex.id) ?? -1;
    const esPR = tieneAnterior && f.weight > prev && f.reps >= ex.minReps;
    maxPeso.set(ex.id, Math.max(prev, f.weight));

    const [log] = await SessionLog.findOrCreate({
      where: { sessionId: session.id, routineExerciseId: ex.id },
      defaults: {
        sessionId: session.id,
        routineExerciseId: ex.id,
        actualWeight: f.weight,
        setsDone: f.sets,
        actualReps: f.reps,
        rir: f.rir ?? null,
        isPR: esPR,
        isInjury: false,
        note: f.note ?? null,
      },
    });

    await log.update({
      actualWeight: f.weight,
      setsDone: f.sets,
      actualReps: f.reps,
      rir: f.rir ?? null,
      isPR: esPR,
      isInjury: false,
      note: f.note ?? null,
    });
    imported++;
  }

  return { sessions: sessionsSet.size, imported, warnings };
}
