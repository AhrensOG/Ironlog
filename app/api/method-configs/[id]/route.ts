import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { MethodConfig } from "@/lib/models";
import { methodConfigSchema } from "@/lib/validation";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const config = await MethodConfig.findOne({ where: { id, userId } });
    if (!config) return error("Configuración no encontrada", 404);

    return json({
      id: config.id,
      name: config.name,
      blockLength: config.blockLength,
      rirPerWeek: config.rirPerWeek,
      deloadVolumePct: config.deloadVolumePct,
      failureRules: config.failureRules,
      progressionStyle: config.progressionStyle,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const config = await MethodConfig.findOne({ where: { id, userId } });
    if (!config) return error("Configuración no encontrada", 404);

    const body = await req.json();
    const parsed = methodConfigSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    await config.update(parsed.data);

    return json({
      id: config.id,
      name: config.name,
      blockLength: config.blockLength,
      rirPerWeek: config.rirPerWeek,
      deloadVolumePct: config.deloadVolumePct,
      failureRules: config.failureRules,
      progressionStyle: config.progressionStyle,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
