import { getSessionUserId } from "@/lib/auth-helpers";
import { EventLog } from "@/lib/models";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const eventos = await EventLog.findAll({
      where: { userId },
      order: [["date", "ASC"]],
    });

    return json(
      eventos.map((e) => ({
        id: e.id,
        date: e.date,
        type: e.type,
        note: e.note,
      })),
    );
  } catch (err) {
    return handleApiError(err);
  }
}
