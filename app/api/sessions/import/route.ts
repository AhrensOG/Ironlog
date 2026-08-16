import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { importHistory } from "@/lib/session-import";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const csv = typeof body?.csv === "string" ? body.csv : "";
    if (!csv.trim()) return error("Falta el contenido CSV", 422);

    const resultado = await importHistory({ userId, csv });

    return json(resultado);
  } catch (err) {
    return handleApiError(err);
  }
}
