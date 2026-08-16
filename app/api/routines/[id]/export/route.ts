import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { MuscleGroup, Routine, RoutineExercise } from "@/lib/models";
import { routineToCsv } from "@/lib/csv";
import { error, handleApiError, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const routine = await Routine.findOne({
      where: { id, userId },
      include: [
        {
          model: RoutineExercise,
          as: "exercises",
          include: [{ model: MuscleGroup, as: "muscleGroup" }],
        },
      ],
    });
    if (!routine) return error("Rutina no encontrada", 404);

    const csv = routineToCsv(
      (routine.exercises ?? []).map((e) => ({
        id: e.id,
        weekday: e.weekday,
        name: e.name,
        sets: e.sets,
        minReps: e.minReps,
        maxReps: e.maxReps,
        weightType: e.weightType,
        fixedBar: e.fixedBar,
        currentLoad: e.currentLoad,
        equipmentIncrement: e.equipmentIncrement,
        baseRir: e.baseRir,
        muscleGroup: e.muscleGroup?.name ?? "",
        order: e.order,
        variantOfId: e.variantOfId,
        rotationMode: e.rotationMode,
      })),
    );

    const filename = `rutina_${routine.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.csv`;

    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
