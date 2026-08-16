import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MuscleGroup,
  Routine,
  RoutineExercise,
  Session,
  SessionLog,
} from "@/lib/models";
import { epley1RM } from "@/lib/progression";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get("exerciseId");

    const routine = await Routine.findOne({ where: { userId, isActive: true } });

    if (exerciseId) {
      const exercise = await RoutineExercise.findOne({
        where: { id: exerciseId },
        include: [
          { model: Routine, as: "routine" },
          { model: MuscleGroup, as: "muscleGroup" },
        ],
      });
      if (!exercise || exercise.routine?.userId !== userId) {
        return json({ exercise: null, serie: [] });
      }

      const logs = await SessionLog.findAll({
        where: { routineExerciseId: exerciseId },
        include: [{ model: Session, as: "session", attributes: ["date"] }],
        order: [["createdAt", "ASC"]],
      });

      return json({
        exercise: {
          id: exercise.id,
          name: exercise.name,
          group: exercise.muscleGroup?.name ?? "",
          minReps: exercise.minReps,
          maxReps: exercise.maxReps,
          equipmentIncrement: exercise.equipmentIncrement,
        },
        serie: logs.map((l) => ({
          date: l.session?.date ?? "",
          weight: l.actualWeight,
          reps: l.actualReps,
          rir: l.rir,
          e1rm: epley1RM(l.actualWeight, l.actualReps),
          isPR: l.isPR,
          isInjury: l.isInjury,
        })),
      });
    }

    // Sin exerciseId: resumen general (PRs + lista de exercises con datos).
    const exercises = routine
      ? await RoutineExercise.findAll({
          where: { routineId: routine.id },
          include: [{ model: MuscleGroup, as: "muscleGroup" }],
          order: [
            ["weekday", "ASC"],
            ["order", "ASC"],
          ],
        })
      : [];

    const ids = exercises.map((e) => e.id);
    const logs = ids.length
      ? await SessionLog.findAll({
          where: { routineExerciseId: ids },
          include: [{ model: Session, as: "session", attributes: ["date"] }],
          order: [["createdAt", "ASC"]],
        })
      : [];

    const prs = logs
      .filter((l) => l.isPR)
      .map((l) => {
        const ex = exercises.find((e) => e.id === l.routineExerciseId);
        return {
          id: l.id,
          date: l.session?.date ?? "",
          exercise: ex?.name ?? "",
          weight: l.actualWeight,
          reps: l.actualReps,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return json({
      prs,
      exercises: exercises.map((e) => {
        const serie = logs
          .filter((l) => l.routineExerciseId === e.id)
          .map((l) => ({
            date: l.session?.date ?? "",
            weight: l.actualWeight,
            reps: l.actualReps,
          }));
        const last = serie[serie.length - 1];
        return {
          id: e.id,
          name: e.name,
          group: e.muscleGroup?.name ?? "",
          registros: serie.length,
          last: last ?? null,
        };
      }),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
