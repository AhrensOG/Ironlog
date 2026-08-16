import { getSessionUserId } from "@/lib/auth-helpers";
import {
  AmrapTest,
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  TrainingBlock,
} from "@/lib/models";
import { getBlockWeek } from "@/lib/progression";
import { handleApiError, json, unauthorized } from "@/lib/api";
import { todayISO } from "@/lib/dates";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const routine = await Routine.findOne({
      where: { userId, isActive: true },
      include: [{ model: MethodConfig, as: "methodConfig" }],
    });

    if (!routine) {
      return json({ routine: null, block: null, amraps: [], exercises: [] });
    }

    const block = await TrainingBlock.findOne({
      where: { routineId: routine.id, status: "active" },
    });

    if (!block) {
      return json({
        routine: { id: routine.id, name: routine.name },
        block: null,
        amraps: [],
        exercises: [],
      });
    }

    const mc = routine.methodConfig;
    const today = todayISO();
    const weekInfo = getBlockWeek({
      startDate: block.startDate,
      date: today,
      blockLength: mc?.blockLength ?? 6,
      rirPerWeek: mc?.rirPerWeek ?? [3, 3, 2, 2, 1, 1],
    });

    const exercises = await RoutineExercise.findAll({
      where: { routineId: routine.id },
      include: [{ model: MuscleGroup, as: "muscleGroup" }],
      order: [
        ["weekday", "ASC"],
        ["order", "ASC"],
      ],
    });

    const amraps = await AmrapTest.findAll({
      where: { trainingBlockId: block.id },
      include: [{ model: RoutineExercise, as: "routineExercise" }],
    });

    return json({
      routine: { id: routine.id, name: routine.name },
      block: {
        id: block.id,
        number: block.number,
        startDate: block.startDate,
        week: weekInfo.week,
        targetRir: weekInfo.targetRir,
        isDeload: weekInfo.isDeload,
        deloadPassed: weekInfo.week > (mc?.blockLength ?? 6) + 1,
        blockLength: mc?.blockLength ?? 6,
        rirPerWeek: mc?.rirPerWeek ?? [3, 3, 2, 2, 1, 1],
      },
      amraps: amraps.map((a) => ({
        id: a.id,
        routineExerciseId: a.routineExerciseId,
        name: a.routineExercise?.name ?? "",
        weight: a.weight,
        reps: a.reps,
        e1rm: a.e1rm,
      })),
      exercises: exercises.map((e) => ({
        id: e.id,
        name: e.name,
        weekday: e.weekday,
        currentLoad: e.currentLoad,
        muscleGroup: e.muscleGroup ? { name: e.muscleGroup.name } : null,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
