import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  EventLog,
  MethodConfig,
  Routine,
  RoutineExercise,
  Session,
  SessionLog,
  TrainingBlock,
} from "@/lib/models";
import {
  countConsecutiveFails,
  suggestNext,
  type LastLog,
} from "@/lib/progression";
import { error, handleApiError, json, unauthorized } from "@/lib/api";
import { todayISO } from "@/lib/dates";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const block = await TrainingBlock.findOne({
      where: { id, status: "active" },
      include: [{ model: Routine, as: "routine" }],
    });
    if (!block || block.routine?.userId !== userId) {
      return error("Bloque no encontrado", 404);
    }

    const routine = await Routine.findByPk(block.routineId, {
      include: [{ model: MethodConfig, as: "methodConfig" }],
    });
    if (!routine) return error("Rutina no encontrada", 404);

    const mc = routine.methodConfig;
    const rirPerWeek = mc?.rirPerWeek ?? [3, 3, 2, 2, 1, 1];
    const rirStart = rirPerWeek[0] ?? 2;

    const exercises = await RoutineExercise.findAll({
      where: { routineId: routine.id },
    });

    // Historial de logs por ejercicio (para recalibrar cargas del próximo bloque).
    const historyByExercise = new Map<string, SessionLog[]>();
    if (exercises.length > 0) {
      const logs = await SessionLog.findAll({
        where: { routineExerciseId: exercises.map((e) => e.id) },
        include: [{ model: Session, as: "session", attributes: ["date"] }],
      });
      for (const log of logs) {
        const list = historyByExercise.get(log.routineExerciseId) ?? [];
        list.push(log);
        historyByExercise.set(log.routineExerciseId, list);
      }
    }

    let recalibrated = 0;

    for (const exercise of exercises) {
      const history = (historyByExercise.get(exercise.id) ?? [])
        .map(
          (l): LastLog => ({
            date: l.session?.date ?? "",
            actualWeight: l.actualWeight,
            actualReps: l.actualReps,
            rir: l.rir,
            isInjury: l.isInjury,
          }),
        )
        .sort((a, b) => b.date.localeCompare(a.date));

      const last = history[0] ?? null;
      if (!last) continue;

      const failures = countConsecutiveFails(history, exercise.minReps);
      const suggestion = suggestNext({
        exercise: {
          id: exercise.id,
          name: exercise.name,
          minReps: exercise.minReps,
          maxReps: exercise.maxReps,
          weightType: exercise.weightType,
          fixedBar: exercise.fixedBar,
          equipmentIncrement: exercise.equipmentIncrement,
          currentLoad: exercise.currentLoad,
        },
        last,
        targetRir: rirStart,
        consecutiveFails: failures,
      });

      await exercise.update({ currentLoad: suggestion.weight });
      recalibrated++;
    }

    const today = todayISO();
    await block.update({ status: "closed", closedAt: today });

    const newBlock = await TrainingBlock.create({
      routineId: routine.id,
      number: block.number + 1,
      startDate: today,
      status: "active",
    });

    await EventLog.create({
      userId,
      date: today,
      type: "blockStart",
      note: `Bloque ${newBlock.number} iniciado (${routine.name})`,
    });

    return json({
      block: {
        id: newBlock.id,
        number: newBlock.number,
        startDate: newBlock.startDate,
        status: newBlock.status,
      },
      recalibrated,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
