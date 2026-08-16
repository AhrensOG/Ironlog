import { getSessionUserId } from "@/lib/auth-helpers";
import { LearningContent } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const contents = await LearningContent.findAll({
      where: { lang: "es" },
      order: [
        ["type", "ASC"],
        ["order", "ASC"],
        ["title", "ASC"],
      ],
    });

    return json(
      contents.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        level: c.level,
        type: c.type,
        category: c.category,
        order: c.order,
      })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
