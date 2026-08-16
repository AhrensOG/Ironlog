import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  RoutineTemplate,
} from "@/lib/models";
import { Op } from "sequelize";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const templates = await RoutineTemplate.findAll({
      where: {
        [Op.or]: [
          { isSeed: true },
          { authorId: userId },
          { isPublic: true },
        ],
      },
      order: [
        ["isSeed", "DESC"],
        ["name", "ASC"],
      ],
    });

    return json(
      templates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        level: t.level,
        tags: t.tags,
        articles: t.articles,
        isSeed: t.isSeed,
        isPublic: t.isPublic,
        isOwn: t.authorId === userId,
        activations: t.activations,
        days: [
          ...new Set((t.content.exercises ?? []).map((e) => e.weekday)),
        ].sort((a, b) => a - b),
        exercises: (t.content.exercises ?? []).length,
        metodo: t.content.methodConfig?.name ?? "",
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

    const body = await req.json().catch(() => ({}));
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim().slice(0, 80)
        : null;
    const description =
      typeof body?.description === "string" && body.description.trim()
        ? body.description.trim().slice(0, 500)
        : "Mi rutina personal";

    const routine = await Routine.findOne({
      where: { userId, isActive: true },
      include: [
        { model: MethodConfig, as: "methodConfig" },
        {
          model: RoutineExercise,
          as: "exercises",
          include: [{ model: MuscleGroup, as: "muscleGroup" }],
        },
      ],
    });

    if (!routine) {
      return json({ error: "No tienes una rutina activa para guardar" }, 422);
    }

    const mc = routine.methodConfig;
    if (!mc) {
      return json({ error: "La rutina no tiene metodología configurada" }, 422);
    }

    const template = await RoutineTemplate.create({
      name: name ?? routine.name,
      description,
      level: "intermedio",
      tags: ["personal"],
      articles: [],
      authorId: userId,
      isPublic: false,
      isSeed: false,
      content: {
        methodConfig: {
          name: mc.name,
          blockLength: mc.blockLength,
          rirPerWeek: mc.rirPerWeek,
          deloadVolumePct: mc.deloadVolumePct,
          failureRules: mc.failureRules,
          progressionStyle: mc.progressionStyle,
        },
        exercises: (routine.exercises ?? [])
          .map((e) => ({
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
            muscleGroup: e.muscleGroup?.name ?? "",
          }))
          .sort((a, b) => a.weekday - b.weekday || a.order - b.order),
      },
    });

    return json(
      {
        id: template.id,
        name: template.name,
        isOwn: true,
      },
      201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
