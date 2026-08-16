import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { ExerciseCatalog, MuscleGroup } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const muscleGroupId = searchParams.get("muscleGroupId");
    const pattern = searchParams.get("patron");

    const where: Record<string, unknown> = {};
    if (muscleGroupId) where.muscleGroupId = muscleGroupId;
    if (pattern) where.pattern = pattern;

    const items = await ExerciseCatalog.findAll({
      where,
      include: [{ model: MuscleGroup, as: "muscleGroup" }],
      order: [
        ["order", "ASC"],
        ["name", "ASC"],
      ],
    });

    return json(
      items.map((c) => ({
        id: c.id,
        name: c.name,
        pattern: c.pattern,
        weightType: c.weightType,
        description: c.description,
        muscleGroup: c.muscleGroup
          ? { id: c.muscleGroup.id, name: c.muscleGroup.name }
          : null,
      })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
