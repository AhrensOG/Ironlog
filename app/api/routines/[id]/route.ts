import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  AmrapTest,
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  SessionLog,
  TrainingBlock,
} from "@/lib/models";
import { routineUpdateSchema } from "@/lib/validation";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const routine = await Routine.findOne({
      where: { id, userId },
      include: [
        { model: MethodConfig, as: "methodConfig" },
        {
          model: RoutineExercise,
          as: "exercises",
          include: [{ model: MuscleGroup, as: "muscleGroup" }],
        },
      ],
    });
    if (!routine) return error("Rutina no encontrada", 404);

    const exercises = (routine.exercises ?? [])
      .map((e) => ({
        id: e.id,
        weekday: e.weekday,
        name: e.name,
        order: e.order,
        sets: e.sets,
        minReps: e.minReps,
        maxReps: e.maxReps,
        weightType: e.weightType,
        fixedBar: e.fixedBar,
        currentLoad: e.currentLoad,
        equipmentIncrement: e.equipmentIncrement,
        baseRir: e.baseRir,
        muscleGroupId: e.muscleGroupId,
        variantOfId: e.variantOfId,
        rotationMode: e.rotationMode,
        activeVariantId: e.activeVariantId,
        muscleGroup: e.muscleGroup
          ? { id: e.muscleGroup.id, name: e.muscleGroup.name }
          : null,
      }))
      .sort((a, b) => a.weekday - b.weekday || a.order - b.order);

    return json({
      id: routine.id,
      name: routine.name,
      isActive: routine.isActive,
      startDate: routine.startDate,
      methodConfig: routine.methodConfig
        ? {
            id: routine.methodConfig.id,
            name: routine.methodConfig.name,
            blockLength: routine.methodConfig.blockLength,
            rirPerWeek: routine.methodConfig.rirPerWeek,
            deloadVolumePct: routine.methodConfig.deloadVolumePct,
            failureRules: routine.methodConfig.failureRules,
            progressionStyle: routine.methodConfig.progressionStyle,
          }
        : null,
      exercises,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const routine = await Routine.findOne({ where: { id, userId } });
    if (!routine) return error("Rutina no encontrada", 404);

    const body = await req.json();
    const parsed = routineUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { name, startDate, isActive } = parsed.data;

    if (isActive === true) {
      await Routine.update(
        { isActive: false },
        { where: { userId, isActive: true } },
      );
      await routine.update({ isActive: true });

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

    if (name !== undefined) routine.set("name", name);
    if (startDate !== undefined) routine.set("startDate", startDate);

    await routine.save();

    return json({
      id: routine.id,
      name: routine.name,
      isActive: routine.isActive,
      startDate: routine.startDate,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const routine = await Routine.findOne({ where: { id, userId } });
    if (!routine) return error("Rutina no encontrada", 404);

    if (routine.isActive) {
      return error(
        "No puedes eliminar la rutina activa. Activa primero otra rutina.",
        409,
      );
    }

    const exercises = await RoutineExercise.findAll({
      where: { routineId: routine.id },
    });
    const exerciseIds = exercises.map((e) => e.id);

    let deletedLogs = 0;
    if (exerciseIds.length > 0) {
      deletedLogs = await SessionLog.destroy({
        where: { routineExerciseId: exerciseIds },
      });
    }
    await RoutineExercise.destroy({ where: { routineId: routine.id } });

    const blocks = await TrainingBlock.findAll({
      where: { routineId: routine.id },
    });
    const blockIds = blocks.map((b) => b.id);
    if (blockIds.length > 0) {
      await AmrapTest.destroy({ where: { trainingBlockId: blockIds } });
    }
    await TrainingBlock.destroy({ where: { routineId: routine.id } });

    await routine.destroy();

    return json({ ok: true, deletedLogs });
  } catch (err) {
    return handleApiError(err);
  }
}
