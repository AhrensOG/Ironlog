import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { Routine, RoutineExercise, Session, SessionLog } from "@/lib/models";
import { handleApiError, json, unauthorized, error } from "@/lib/api";
import { z } from "zod";

const sessionLogSchema = z.object({
  sessionId: z.string().uuid(),
  routineExerciseId: z.string().uuid(),
  actualWeight: z.number().min(0),
  setsDone: z.number().int().min(0),
  actualReps: z.number().int().min(0),
  rir: z.number().int().min(0).max(5).nullable().optional(),
  isPR: z.boolean().optional(),
  isInjury: z.boolean().optional(),
  note: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const parsed = sessionLogSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { sessionId, routineExerciseId } = parsed.data;

    const session = await Session.findOne({ where: { id: sessionId, userId } });
    if (!session) return error("Sesión no encontrada", 404);

    const exercise = await RoutineExercise.findOne({
      where: { id: routineExerciseId },
      include: [{ model: Routine, as: "routine" }],
    });
    if (!exercise || exercise.routine?.userId !== userId) {
      return error("Ejercicio no encontrado", 404);
    }

    const existing = await SessionLog.findOne({
      where: { sessionId, routineExerciseId },
    });

    // Detección automática de PR: superar el mejor weight anterior registrado
    // (el primer registro de un ejercicio no es un PR).
    let isPR = parsed.data.isPR;
    if (isPR === undefined) {
      const anteriores = await SessionLog.findAll({
        where: { routineExerciseId },
      });
      const previos = anteriores.filter((l) => l.id !== existing?.id);
      const maxAnterior = previos.reduce((m, l) => Math.max(m, l.actualWeight), -1);
      isPR =
        previos.length > 0 &&
        parsed.data.actualWeight > maxAnterior &&
        parsed.data.actualReps >= exercise.minReps;
    }

    const datos = {
      actualWeight: parsed.data.actualWeight,
      setsDone: parsed.data.setsDone,
      actualReps: parsed.data.actualReps,
      rir: parsed.data.rir ?? null,
      isPR: isPR ?? false,
      isInjury: parsed.data.isInjury ?? false,
      note: parsed.data.note ?? null,
    };

    const log = existing
      ? await existing.update(datos)
      : await SessionLog.create({ sessionId, routineExerciseId, ...datos });

    return json(
      {
        id: log.id,
        actualWeight: log.actualWeight,
        setsDone: log.setsDone,
        actualReps: log.actualReps,
        rir: log.rir,
        isPR: log.isPR,
        isInjury: log.isInjury,
        note: log.note,
        esPR: isPR === true,
      },
      existing ? 200 : 201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
