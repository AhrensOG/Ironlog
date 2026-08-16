import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  AmrapTest,
  Routine,
  RoutineExercise,
  TrainingBlock,
} from "@/lib/models";
import { epley1RM } from "@/lib/progression";
import { error, handleApiError, json, unauthorized } from "@/lib/api";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const amrapSchema = z.object({
  routineExerciseId: z.string().uuid(),
  weight: z.number().min(0),
  reps: z.number().int().min(1).max(100),
});

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

    const body = await req.json();
    const parsed = amrapSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const exercise = await RoutineExercise.findOne({
      where: { id: parsed.data.routineExerciseId, routineId: block.routineId },
    });
    if (!exercise) return error("Ejercicio no encontrado", 404);

    const e1rm = epley1RM(parsed.data.weight, parsed.data.reps);

    const existing = await AmrapTest.findOne({
      where: {
        trainingBlockId: block.id,
        routineExerciseId: exercise.id,
      },
    });

    const test = existing
      ? await existing.update({
          weight: parsed.data.weight,
          reps: parsed.data.reps,
          e1rm,
        })
      : await AmrapTest.create({
          trainingBlockId: block.id,
          routineExerciseId: exercise.id,
          weight: parsed.data.weight,
          reps: parsed.data.reps,
          e1rm,
        });

    return json(
      {
        id: test.id,
        routineExerciseId: test.routineExerciseId,
        weight: test.weight,
        reps: test.reps,
        e1rm: test.e1rm,
      },
      existing ? 200 : 201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
