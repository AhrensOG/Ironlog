import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { Routine, RoutineExercise } from "@/lib/models";
import { routineExerciseUpdateSchema } from "@/lib/validation";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

async function findOwned(id: string, userId: string) {
  const exercise = await RoutineExercise.findOne({
    where: { id },
    include: [{ model: Routine, as: "routine" }],
  });
  if (!exercise || exercise.routine?.userId !== userId) return null;
  return exercise;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const exercise = await findOwned(id, userId);
    if (!exercise) return error("Ejercicio no encontrado", 404);

    const body = await req.json();
    const parsed = routineExerciseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const data = parsed.data;
    if (data.minReps !== undefined && data.maxReps !== undefined && data.minReps > data.maxReps) {
      return error("minReps no puede ser mayor que maxReps", 422);
    }
    if (data.minReps !== undefined && data.minReps > exercise.maxReps) {
      return error("minReps no puede ser mayor que maxReps", 422);
    }
    if (data.maxReps !== undefined && data.maxReps < exercise.minReps) {
      return error("maxReps no puede ser menor que minReps", 422);
    }

    // La variante isActive debe ser una variante hija de este ejercicio.
    if (data.activeVariantId !== undefined && data.activeVariantId !== null) {
      const hija = await RoutineExercise.findOne({
        where: {
          id: data.activeVariantId,
          variantOfId: exercise.id,
        },
      });
      if (!hija) {
        return error("La variante activa debe ser una variante de este ejercicio", 422);
      }
    }

    await exercise.update(data);

    return json({
      id: exercise.id,
      name: exercise.name,
      weekday: exercise.weekday,
      order: exercise.order,
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
    const exercise = await findOwned(id, userId);
    if (!exercise) return error("Ejercicio no encontrado", 404);

    await exercise.destroy();

    return json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
