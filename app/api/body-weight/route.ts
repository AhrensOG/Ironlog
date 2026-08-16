import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { BodyWeight } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";
import { z } from "zod";

const bodyWeightSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight: z.number().min(20).max(400),
});

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const weights = await BodyWeight.findAll({
      where: { userId },
      order: [["date", "ASC"]],
    });

    return json(weights.map((p) => ({ id: p.id, date: p.date, weight: p.weight })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const parsed = bodyWeightSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const existing = await BodyWeight.findOne({
      where: { userId, date: parsed.data.date },
    });

    const registro = existing
      ? await existing.update({ weight: parsed.data.weight })
      : await BodyWeight.create({ userId, ...parsed.data });

    return json({ id: registro.id, date: registro.date, weight: registro.weight });
  } catch (err) {
    return handleApiError(err);
  }
}
