import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import { MuscleGroup, RoutineExercise, Session, SessionLog } from "@/lib/models";
import { Op } from "sequelize";
import { handleApiError, unauthorized } from "@/lib/api";
import { todayISO, weekRange } from "@/lib/dates";

function escapeCsv(value: string): string {
  if (/[;"\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") ?? todayISO();
    const { start, end } = weekRange(date);

    const sessions = await Session.findAll({
      where: { userId, date: { [Op.gte]: start, [Op.lte]: end } },
      include: [
        {
          model: SessionLog,
          as: "logs",
          include: [
            {
              model: RoutineExercise,
              as: "routineExercise",
              include: [{ model: MuscleGroup, as: "muscleGroup" }],
            },
          ],
        },
      ],
      order: [["date", "ASC"]],
    });

    const header = [
      "semana",
      "date",
      "ejercicio",
      "grupo",
      "weight",
      "series",
      "reps",
      "rir",
      "pr",
      "lesion",
      "note",
    ];

    const rows: string[][] = [];
    for (const s of sessions) {
      for (const log of s.logs ?? []) {
        rows.push([
          `${start} → ${end}`,
          s.date,
          log.routineExercise?.name ?? "",
          log.routineExercise?.muscleGroup?.name ?? "",
          String(log.actualWeight),
          String(log.setsDone),
          String(log.actualReps),
          log.rir != null ? String(log.rir) : "",
          log.isPR ? "si" : "",
          log.isInjury ? "si" : "",
          log.note ?? "",
        ]);
      }
    }

    const csv = [header, ...rows]
      .map((r) => r.map(escapeCsv).join(","))
      .join("\n");

    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ironlog_semana_${start}.csv"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
