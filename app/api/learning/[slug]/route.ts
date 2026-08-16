import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { LearningContent } from "@/lib/models";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { slug } = await params;
    const content = await LearningContent.findOne({ where: { slug, lang: "es" } });
    if (!content) return error("Contenido no encontrado", 404);

    return json({
      id: content.id,
      slug: content.slug,
      title: content.title,
      level: content.level,
      type: content.type,
      category: content.category,
      content: content.content,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
