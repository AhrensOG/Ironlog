import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  RoutineTemplate,
  TrainingBlock,
} from "@/lib/models";
import { error, handleApiError, json, unauthorized } from "@/lib/api";
import { todayISO } from "@/lib/dates";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const template = await RoutineTemplate.findByPk(id);
    if (!template) return error("Plantilla no encontrada", 404);

    const body = await req.json().catch(() => ({}));
    const startDate =
      typeof body?.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.startDate)
        ? body.startDate
        : todayISO();

    const { methodConfig, exercises } = template.content;

    // Resolver grupos musculares; crear los faltantes con range por defecto.
    const groupNames = [
      ...new Set((exercises ?? []).map((e) => e.muscleGroup)),
    ];
    const grupoMap = new Map<string, MuscleGroup>();
    for (const nombreGrupo of groupNames) {
      let group = await MuscleGroup.findOne({ where: { name: nombreGrupo } });
      if (!group) {
        group = await MuscleGroup.create({
          name: nombreGrupo,
          minReps: 10,
          maxReps: 14,
          order: 99,
        });
      }
      grupoMap.set(nombreGrupo, group);
    }

    const mc = await MethodConfig.create({
      userId,
      name: methodConfig?.name ?? template.name,
      blockLength: methodConfig?.blockLength ?? 6,
      rirPerWeek: methodConfig?.rirPerWeek ?? [3, 3, 2, 2, 1, 1],
      deloadVolumePct: methodConfig?.deloadVolumePct ?? 0.6,
      failureRules: methodConfig?.failureRules ?? {
        semanasFalloSeguidas: 2,
        ajustePct: -5,
      },
      progressionStyle: methodConfig?.progressionStyle ?? "doble",
    });

    const hayActiva = await Routine.findOne({ where: { userId, isActive: true } });

    const routine = await Routine.create({
      userId,
      methodConfigId: mc.id,
      name: template.name,
      startDate,
      isActive: !hayActiva,
    });

    await RoutineExercise.bulkCreate(
      (exercises ?? []).map((e) => ({
        routineId: routine.id,
        muscleGroupId: grupoMap.get(e.muscleGroup)!.id,
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
      })),
    );

    if (routine.isActive) {
      await TrainingBlock.create({
        routineId: routine.id,
        number: 1,
        startDate,
        status: "active",
      });
    }

    await template.increment("activations");

    return json(
      {
        routine: { id: routine.id, name: routine.name, isActive: routine.isActive },
        exercises: (exercises ?? []).length,
      },
      201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const template = await RoutineTemplate.findByPk(id);
    if (!template) return error("Plantilla no encontrada", 404);
    if (template.isSeed || template.authorId !== userId) {
      return error("No puedes eliminar esta plantilla", 403);
    }

    await template.destroy();

    return json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
