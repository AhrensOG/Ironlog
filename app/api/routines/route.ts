import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MethodConfig,
  Routine,
  RoutineExercise,
  SessionLog,
  TrainingBlock,
} from "@/lib/models";
import { routineSchema } from "@/lib/validation";
import { handleApiError, json, unauthorized } from "@/lib/api";

async function getOrCreateDefaultMethodConfig(userId: string) {
  const existing = await MethodConfig.findOne({ where: { userId } });
  if (existing) return existing;
  return MethodConfig.create({
    userId,
    name: "Evidencia 6+1",
  });
}

async function ensureActiveBlock(routine: Routine) {
  const block = await TrainingBlock.findOne({
    where: { routineId: routine.id, status: "active" },
  });
  if (!block) {
    await TrainingBlock.create({
      routineId: routine.id,
      number: 1,
      startDate: routine.startDate,
      status: "active",
    });
  }
}

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const routines = await Routine.findAll({
      where: { userId },
      include: [{ model: MethodConfig, as: "methodConfig" }],
      order: [["createdAt", "ASC"]],
    });

    const exerciseCounts = await RoutineExercise.findAll({
      attributes: [
        "routineId",
        [RoutineExercise.sequelize!.fn("COUNT", "id"), "count"],
      ],
      group: ["routineId"],
    });
    const countMap = new Map(
      exerciseCounts.map((e) => [e.routineId, Number(e.get("count"))]),
    );

    // Conteo de registros de historial por rutina (para el aviso al borrar).
    const exerciseRows = await RoutineExercise.findAll({
      attributes: ["id", "routineId"],
      where: { routineId: routines.map((r) => r.id) },
    });
    const routineByExercise = new Map(
      exerciseRows.map((e) => [e.id, e.routineId]),
    );
    const logsByRoutine = new Map<string, number>();
    if (exerciseRows.length > 0) {
      const logCounts = await SessionLog.findAll({
        attributes: [
          "routineExerciseId",
          [SessionLog.sequelize!.fn("COUNT", "id"), "count"],
        ],
        where: { routineExerciseId: exerciseRows.map((e) => e.id) },
        group: ["routineExerciseId"],
      });
      for (const l of logCounts) {
        const rid = routineByExercise.get(l.routineExerciseId);
        if (!rid) continue;
        logsByRoutine.set(rid, (logsByRoutine.get(rid) ?? 0) + Number(l.get("count")));
      }
    }

    return json(
      routines.map((r) => ({
        id: r.id,
        name: r.name,
        isActive: r.isActive,
        startDate: r.startDate,
        exercises: countMap.get(r.id) ?? 0,
        logs: logsByRoutine.get(r.id) ?? 0,
        methodConfig: r.methodConfig
          ? {
              id: r.methodConfig.id,
              name: r.methodConfig.name,
            }
          : null,
      })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const parsed = routineSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { name, startDate } = parsed.data;
    const methodConfig = await getOrCreateDefaultMethodConfig(userId);

    const existing = await Routine.findOne({ where: { userId, isActive: true } });
    const isActive = !existing;

    const routine = await Routine.create({
      userId,
      methodConfigId: methodConfig.id,
      name,
      startDate,
      isActive,
    });

    if (isActive) {
      await ensureActiveBlock(routine);
    }

    return json(
      {
        id: routine.id,
        name: routine.name,
        isActive: routine.isActive,
        startDate: routine.startDate,
      },
      201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
