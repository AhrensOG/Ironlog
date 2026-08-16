import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { ExerciseCatalog, MuscleGroup, Routine, RoutineExercise } from "@/lib/models";
import { routineExerciseSchema } from "@/lib/validation";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const routineId = searchParams.get("routineId");
    if (!routineId) return error("Falta routineId", 422);

    const routine = await Routine.findOne({ where: { id: routineId, userId } });
    if (!routine) return error("Rutina no encontrada", 404);

    const exercises = await RoutineExercise.findAll({
      where: { routineId },
      include: [{ model: MuscleGroup, as: "muscleGroup" }],
      order: [
        ["weekday", "ASC"],
        ["order", "ASC"],
      ],
    });

    return json(
      exercises.map((e) => ({
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
        variantOfId: e.variantOfId,
        rotationMode: e.rotationMode,
        activeVariantId: e.activeVariantId,
        muscleGroup: e.muscleGroup
          ? { id: e.muscleGroup.id, name: e.muscleGroup.name }
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

    // Si viene del catálogo, prefijar datos del ejercicio elegido.
    let merged = body;
    if (typeof body?.catalogExerciseId === "string" && body.catalogExerciseId) {
      const cat = await ExerciseCatalog.findByPk(body.catalogExerciseId);
      if (!cat) return error("Ejercicio del catálogo no encontrado", 404);
      merged = {
        ...body,
        name: typeof body.name === "string" && body.name.trim() ? body.name : cat.name,
        muscleGroupId: body.muscleGroupId ?? cat.muscleGroupId,
        weightType: body.weightType ?? cat.weightType,
      };
    }

    const parsed = routineExerciseSchema.safeParse(merged);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const routine = await Routine.findOne({
      where: { id: parsed.data.routineId, userId },
    });
    if (!routine) return error("Rutina no encontrada", 404);

    // Si es una variante, hereda día y group del parent (mismo patrón).
    let weekday = parsed.data.weekday;
    let muscleGroupId = parsed.data.muscleGroupId;
    if (parsed.data.variantOfId) {
      const parent = await RoutineExercise.findOne({
        where: { id: parsed.data.variantOfId, routineId: routine.id },
      });
      if (!parent) return error("Ejercicio padre no encontrado", 404);
      weekday = parent.weekday;
      muscleGroupId = parent.muscleGroupId;
    }

    const maxOrder = await RoutineExercise.max("order", {
      where: { routineId: routine.id },
    });
    const order = parsed.data.order ?? Number(maxOrder ?? 0) + 1;

    const exercise = await RoutineExercise.create({
      routineId: routine.id,
      muscleGroupId,
      weekday,
      name: parsed.data.name,
      order,
      sets: parsed.data.sets,
      minReps: parsed.data.minReps,
      maxReps: parsed.data.maxReps,
      weightType: parsed.data.weightType,
      fixedBar: parsed.data.fixedBar ?? null,
      currentLoad: parsed.data.currentLoad,
      equipmentIncrement: parsed.data.equipmentIncrement,
      baseRir: parsed.data.baseRir,
      variantOfId: parsed.data.variantOfId ?? null,
      rotationMode: parsed.data.rotationMode ?? "manual",
      activeVariantId: parsed.data.activeVariantId ?? null,
    });

    return json(
      {
        id: exercise.id,
        name: exercise.name,
        weekday: exercise.weekday,
        order: exercise.order,
        variantOfId: exercise.variantOfId,
      },
      201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
