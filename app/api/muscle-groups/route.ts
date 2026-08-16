import { getSessionUserId } from "@/lib/auth-helpers";
import { MuscleGroup } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const groups = await MuscleGroup.findAll({
      order: [["order", "ASC"], ["name", "ASC"]],
    });

    return json(
      groups.map((g) => ({
        id: g.id,
        name: g.name,
        minReps: g.minReps,
        maxReps: g.maxReps,
        order: g.order,
      })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
