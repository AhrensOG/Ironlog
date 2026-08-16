import { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth-helpers";
import {
  MethodConfig,
  MuscleGroup,
  Routine,
  RoutineExercise,
  TrainingBlock,
} from "@/lib/models";
import { parseRoutineCsv } from "@/lib/csv";
import { error, handleApiError, json, unauthorized } from "@/lib/api";
import { todayISO } from "@/lib/dates";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const name = typeof body?.name === "string" && body.name.trim()
      ? body.name.trim()
      : null;
    const startDate = typeof body?.startDate === "string"
      ? body.startDate
      : todayISO();
    const csv = typeof body?.csv === "string" ? body.csv : "";

    if (!name) {
      return error("Falta el nombre de la rutina", 422);
    }

    const { rows, errors } = parseRoutineCsv(csv);
    if (rows.length === 0) {
      return json(
        {
          error: "No se pudo importar ningún ejercicio",
          details: errors.slice(0, 10),
        },
        422,
      );
    }

    // Resolver grupos musculares; crear los faltantes con range por defecto.
    const warnings: string[] = [];
    const groupNames = [...new Set(rows.map((f) => f.muscleGroup))];
    const grupoMap = new Map<string, MuscleGroup>();
    for (const nombreGrupo of groupNames) {
      let group = await MuscleGroup.findOne({ where: { name: nombreGrupo } });
      if (!group) {
        group = await MuscleGroup.create({
          name: nombreGrupo,
          minReps: 10,
          maxReps: 14,
          order: 99,
        });
        warnings.push(
          `Grupo muscular "${nombreGrupo}" no existía: creado con rango por defecto 10-14 (editable en la app).`,
        );
      }
      grupoMap.set(nombreGrupo, group);
    }

    const methodConfig = await MethodConfig.findOne({ where: { userId } });
    const methodConfigId = methodConfig?.id ?? (
      await MethodConfig.create({ userId, name: "Evidencia 6+1" })
    ).id;

    const hayActiva = await Routine.findOne({ where: { userId, isActive: true } });

    const routine = await Routine.create({
      userId,
      methodConfigId,
      name,
      startDate,
      isActive: !hayActiva,
    });

    const creados = await RoutineExercise.bulkCreate(rows.map((f) => ({
        routineId: routine.id,
        muscleGroupId: grupoMap.get(f.muscleGroup)!.id,
        weekday: f.day,
        name: f.exercise,
        order: f.order,
        sets: f.sets,
        minReps: f.minReps,
        maxReps: f.maxReps,
        weightType: f.weightType,
        fixedBar: f.fixedBar,
        currentLoad: f.load,
        equipmentIncrement: f.increment,
        baseRir: f.rir,
      })),
    );

    // Vincular variants por name (columna opcional variantOf).
    const porNombre = new Map(creados.map((c) => [c.name, c]));
    for (const c of creados) {
      const row = rows.find(
        (f) => f.exercise === c.name && f.day === c.weekday,
      );
      if (!row) continue;

      if (row.variantOf) {
        const parent = porNombre.get(row.variantOf);
        if (parent && parent.id !== c.id) {
          await c.update({ variantOfId: parent.id });
        } else {
          warnings.push(
            `"${row.exercise}": no se encontró el ejercicio padre "${row.variantOf}".`,
          );
        }
      }
      if (row.rotation && !row.variantOf) {
        await c.update({ rotationMode: row.rotation });
      }
    }

    if (routine.isActive) {
      await TrainingBlock.create({
        routineId: routine.id,
        number: 1,
        startDate,
        status: "active",
      });
    }

    return json(
      {
        routine: { id: routine.id, name: routine.name, isActive: routine.isActive },
        importedExercises: rows.length,
        warnings,
        errors,
      },
      201,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
