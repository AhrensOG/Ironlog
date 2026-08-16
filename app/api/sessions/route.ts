import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { Routine, Session, TrainingBlock } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";
import { z } from "zod";

const sessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  routineDay: z.number().int().min(1).max(7).nullable().optional(),
  isRest: z.boolean().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { date } = parsed.data;

    const routine = await Routine.findOne({ where: { userId, isActive: true } });
    const block = routine
      ? await TrainingBlock.findOne({
          where: { routineId: routine.id, status: "active" },
        })
      : null;

    const [session] = await Session.findOrCreate({
      where: { userId, date },
      defaults: {
        userId,
        date,
        trainingBlockId: block?.id ?? null,
        routineDay: parsed.data.routineDay ?? null,
        isRest: parsed.data.isRest ?? false,
        notes: parsed.data.notes ?? null,
      },
    });

    if (parsed.data.routineDay !== undefined) session.set("routineDay", parsed.data.routineDay);
    if (parsed.data.isRest !== undefined) session.set("isRest", parsed.data.isRest);
    if (parsed.data.notes !== undefined) session.set("notes", parsed.data.notes);
    if (block && !session.trainingBlockId) session.set("trainingBlockId", block.id);

    await session.save();

    return json({
      id: session.id,
      date: session.date,
      routineDay: session.routineDay,
      isRest: session.isRest,
      notes: session.notes,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
