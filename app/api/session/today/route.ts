import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  AmrapTest,
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  Session,
  SessionLog,
  TrainingBlock,
} from "@/lib/models";
import {
  countConsecutiveFails,
  getBlockWeek,
  suggestDeload,
  suggestNext,
  type LastLog,
} from "@/lib/progression";
import {
  listGroup,
  resolveActiveVariant,
  type VariantGroup,
} from "@/lib/rotation";
import { todayISO, isoWeekday } from "@/lib/dates";
import { handleApiError, json, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") ?? todayISO();
    const routineDay = searchParams.get("routineDay")
      ? Number(searchParams.get("routineDay"))
      : isoWeekday(date);

    const routine = await Routine.findOne({
      where: { userId, isActive: true },
      include: [{ model: MethodConfig, as: "methodConfig" }],
    });

    if (!routine) {
      return json({
        date,
        routineDay,
        routine: null,
        block: null,
        session: null,
        exercises: [],
      });
    }

    const block = await TrainingBlock.findOne({
      where: { routineId: routine.id, status: "active" },
    });

    const mc = routine.methodConfig;
    const weekInfo = block
      ? getBlockWeek({
          startDate: block.startDate,
          date,
          blockLength: mc?.blockLength ?? 6,
          rirPerWeek: mc?.rirPerWeek ?? [3, 3, 2, 2, 1, 1],
        })
      : null;

    const session = await Session.findOne({
      where: { userId, date },
      include: [{ model: SessionLog, as: "logs" }],
    });

    const logsToday = new Map(
      (session?.logs ?? []).map((l) => [l.routineExerciseId, l]),
    );

    const routineExercises = await RoutineExercise.findAll({
      where: { routineId: routine.id, weekday: routineDay },
      include: [{ model: MuscleGroup, as: "muscleGroup" }],
      order: [["order", "ASC"]],
    });

    // Historial por ejercicio (padres y variants comparten día).
    const historyByExercise = new Map<string, LastLog[]>();
    if (routineExercises.length > 0) {
      const logs = await SessionLog.findAll({
        where: { routineExerciseId: routineExercises.map((e) => e.id) },
        include: [{ model: Session, as: "session", attributes: ["date"] }],
      });
      for (const log of logs) {
        const list = historyByExercise.get(log.routineExerciseId) ?? [];
        list.push({
          date: log.session?.date ?? "",
          actualWeight: log.actualWeight,
          actualReps: log.actualReps,
          rir: log.rir,
          isInjury: log.isInjury,
        });
        historyByExercise.set(log.routineExerciseId, list);
      }
    }

    const historyOf = (exerciseId: string): LastLog[] =>
      (historyByExercise.get(exerciseId) ?? [])
        .filter((l) => l.date !== date)
        .sort((a, b) => b.date.localeCompare(a.date));

    const failsOf = (exercise: RoutineExercise): number =>
      countConsecutiveFails(historyOf(exercise.id), exercise.minReps);

    // Saved AMRAP tests for the deload week.
    const amrapByExercise = new Map<string, { weight: number; reps: number; e1rm: number }>();
    if (weekInfo?.isDeload && block && routineExercises.length > 0) {
      const tests = await AmrapTest.findAll({
        where: {
          trainingBlockId: block.id,
          routineExerciseId: routineExercises.map((e) => e.id),
        },
      });
      for (const test of tests) {
        amrapByExercise.set(test.routineExerciseId, {
          weight: test.weight,
          reps: test.reps,
          e1rm: test.e1rm,
        });
      }
    }

    const targetRir = weekInfo?.targetRir ?? 2;

    // Agrupar variants: parents vs children del día.
    const parents = routineExercises.filter((e) => e.variantOfId == null);
    const childrenOf = new Map<string, RoutineExercise[]>();
    for (const e of routineExercises) {
      if (!e.variantOfId) continue;
      const list = childrenOf.get(e.variantOfId) ?? [];
      list.push(e);
      childrenOf.set(e.variantOfId, list);
    }

    const failsById = new Map(
      routineExercises.map((e) => [e.id, failsOf(e)]),
    );

    const buildSuggestion = (e: RoutineExercise) => {
      const last = historyOf(e.id)[0] ?? null;
      const failures = failsById.get(e.id) ?? 0;
      if (weekInfo?.isDeload) {
        return {
          suggestion: {
            action: "deload",
            weight: suggestDeload(
              last?.actualWeight ?? e.currentLoad,
              mc?.deloadVolumePct ?? 0.6,
              e.equipmentIncrement,
            ),
            reps: e.minReps,
            reason: `Semana de descarga: trabaja al ~${Math.round((mc?.deloadVolumePct ?? 0.6) * 100)}% del volumen.`,
          },
          last,
          failures,
        };
      }
      return {
        suggestion: suggestNext({
          exercise: {
            id: e.id,
            name: e.name,
            minReps: e.minReps,
            maxReps: e.maxReps,
            weightType: e.weightType,
            fixedBar: e.fixedBar,
            equipmentIncrement: e.equipmentIncrement,
            currentLoad: e.currentLoad,
          },
          last,
          targetRir,
          consecutiveFails: failures,
        }),
        last,
        failures,
      };
    };

    const dayExercises = parents.map((parent) => {
      const children = childrenOf.get(parent.id) ?? [];
      let activeExercise: RoutineExercise = parent;
      let group: VariantGroup | null = null;

      if (children.length > 0) {
        group = {
          parent: {
            id: parent.id,
            name: parent.name,
            order: parent.order,
          },
          variants: children.map((h) => ({
            id: h.id,
            name: h.name,
            order: h.order,
          })),
          mode: parent.rotationMode,
          activeId: parent.activeVariantId,
        };
        const failures = Object.fromEntries(
          listGroup(group).map((v) => [v.id, failsById.get(v.id) ?? 0]),
        );
        const resolved = resolveActiveVariant({
          group,
          week: weekInfo?.week ?? 1,
          failures,
        });
        activeExercise =
          resolved.id === parent.id
            ? parent
            : children.find((h) => h.id === resolved.id)!;
      }

      const { suggestion, last } = buildSuggestion(activeExercise);
      const todayLog = logsToday.get(activeExercise.id);

      return {
        id: activeExercise.id,
        name: activeExercise.name,
        order: parent.order,
        sets: activeExercise.sets,
        minReps: activeExercise.minReps,
        maxReps: activeExercise.maxReps,
        weightType: activeExercise.weightType,
        fixedBar: activeExercise.fixedBar,
        currentLoad: activeExercise.currentLoad,
        equipmentIncrement: activeExercise.equipmentIncrement,
        baseRir: activeExercise.baseRir,
        muscleGroup: activeExercise.muscleGroup
          ? { id: activeExercise.muscleGroup.id, name: activeExercise.muscleGroup.name }
          : null,
        last,
        amrap: weekInfo?.isDeload
          ? {
              week6Weight: last?.actualWeight ?? activeExercise.currentLoad,
              saved: amrapByExercise.get(activeExercise.id) ?? null,
            }
          : null,
        suggestion,
        group: group
          ? {
              mode: group.mode,
              parentId: parent.id,
              variants: listGroup(group).map((v) => ({
                id: v.id,
                name: v.name,
              })),
              activeId: activeExercise.id,
              isParent: activeExercise.id === parent.id,
            }
          : null,
        todayLog: todayLog
          ? {
              id: todayLog.id,
              actualWeight: todayLog.actualWeight,
              setsDone: todayLog.setsDone,
              actualReps: todayLog.actualReps,
              rir: todayLog.rir,
              isPR: todayLog.isPR,
              isInjury: todayLog.isInjury,
              note: todayLog.note,
            }
          : null,
      };
    });

    return json({
      date,
      routineDay,
      routine: { id: routine.id, name: routine.name },
      block: weekInfo
        ? {
            id: block?.id ?? null,
            week: weekInfo.week,
            targetRir: weekInfo.targetRir,
            isDeload: weekInfo.isDeload,
            deloadPassed:
              weekInfo.week > (mc?.blockLength ?? 6) + 1,
            blockLength: mc?.blockLength ?? 6,
          }
        : null,
      session: session
        ? {
            id: session.id,
            isRest: session.isRest,
            notes: session.notes,
            routineDay: session.routineDay,
          }
        : null,
      exercises: dayExercises,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
