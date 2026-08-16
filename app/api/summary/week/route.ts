import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MuscleGroup,
  Routine,
  RoutineExercise,
  Session,
  SessionLog,
} from "@/lib/models";
import { Op } from "sequelize";
import { handleApiError, json, unauthorized } from "@/lib/api";
import { todayISO, weekRange } from "@/lib/dates";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") ?? todayISO();
    const { start, end } = weekRange(date);

    const routine = await Routine.findOne({ where: { userId, isActive: true } });
    if (!routine) {
      return json({
        week: { start, end },
        routine: null,
        rows: [],
        auditoria: [],
        sessions: [],
      });
    }

    const exercises = await RoutineExercise.findAll({
      where: { routineId: routine.id },
      include: [{ model: MuscleGroup, as: "muscleGroup" }],
    });
    const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

    const sessions = await Session.findAll({
      where: { userId, date: { [Op.gte]: start, [Op.lte]: end } },
      include: [
        {
          model: SessionLog,
          as: "logs",
          include: [{ model: RoutineExercise, as: "routineExercise" }],
        },
      ],
      order: [["date", "ASC"]],
    });

    // Logs de la week anterior para calcular deltas.
    const prevStart = new Date(`${start}T00:00:00Z`);
    prevStart.setUTCDate(prevStart.getUTCDate() - 7);
    const prevEnd = new Date(`${start}T00:00:00Z`);
    prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
    const sessionsPrev = await Session.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: prevStart.toISOString().slice(0, 10),
          [Op.lte]: prevEnd.toISOString().slice(0, 10),
        },
      },
      include: [{ model: SessionLog, as: "logs" }],
    });

    const prevPorEjercicio = new Map<string, SessionLog[]>();
    for (const s of sessionsPrev) {
      for (const log of s.logs ?? []) {
        const list = prevPorEjercicio.get(log.routineExerciseId) ?? [];
        list.push(log);
        prevPorEjercicio.set(log.routineExerciseId, list);
      }
    }

    // Filas de la tabla week: ejercicio → logs de la week (por date).
    const rows: Array<{
      exercise: string;
      group: string;
      registros: Array<{
        date: string;
        weight: number;
        reps: number;
        rir: number | null;
        sets: number;
        isPR: boolean;
        isInjury: boolean;
        note: string | null;
      }>;
      previousWeight: number | null;
    }> = [];

    for (const exercise of exercises) {
      const registros: typeof rows[number]["registros"] = [];
      for (const s of sessions) {
        for (const log of s.logs ?? []) {
          if (log.routineExerciseId !== exercise.id) continue;
          registros.push({
            date: s.date,
            weight: log.actualWeight,
            reps: log.actualReps,
            rir: log.rir,
            sets: log.setsDone,
            isPR: log.isPR,
            isInjury: log.isInjury,
            note: log.note,
          });
        }
      }
      if (registros.length === 0) continue;

      const prev = (prevPorEjercicio.get(exercise.id) ?? [])
        .map((l) => l.actualWeight)
        .sort((a, b) => a - b);
      const previousWeight = prev.length > 0 ? prev[prev.length - 1] : null;

      rows.push({
        exercise: exercise.name,
        group: exercise.muscleGroup?.name ?? "",
        registros,
        previousWeight,
      });
    }

    // Auditoría MEV/MAV/MRV: sets duras por group muscular.
    const groups = await MuscleGroup.findAll({ order: [["order", "ASC"]] });
    const seriesPorGrupo = new Map<string, number>();
    for (const s of sessions) {
      for (const log of s.logs ?? []) {
        const ex = exerciseMap.get(log.routineExerciseId);
        if (!ex) continue;
        const esDura =
          log.rir == null ? log.actualReps >= ex.minReps : log.rir <= 4;
        if (!esDura || log.setsDone <= 0) continue;
        seriesPorGrupo.set(
          ex.muscleGroupId,
          (seriesPorGrupo.get(ex.muscleGroupId) ?? 0) + log.setsDone,
        );
      }
    }

    const auditoria = groups.map((g) => {
      const sets = seriesPorGrupo.get(g.id) ?? 0;
      const status =
        sets < g.minReps
          ? "belowMEV"
          : sets > g.maxReps
            ? "aboveMRV"
            : "optimal";
      return {
        group: g.name,
        sets,
        minReps: g.minReps,
        maxReps: g.maxReps,
        status,
      };
    });

    return json({
      week: { start, end },
      routine: { id: routine.id, name: routine.name },
      rows,
      auditoria,
      sessions: sessions.map((s) => ({
        date: s.date,
        routineDay: s.routineDay,
        isRest: s.isRest,
        notes: s.notes,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
