import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim(),
  email: z.string().email("Ingresa un email válido").trim().toLowerCase(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const FECHA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido");

export const routineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").trim(),
  startDate: FECHA,
});

export const routineUpdateSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    startDate: FECHA.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "Nada que actualizar");

const routineExerciseFields = {
  muscleGroupId: z.string().uuid(),
  weekday: z.number().int().min(1).max(7),
  name: z.string().min(1, "El nombre es requerido").trim(),
  order: z.number().int().min(1).optional(),
  sets: z.number().int().min(1),
  minReps: z.number().int().min(1),
  maxReps: z.number().int().min(1),
  weightType: z.enum(["total", "porLado", "barraDiscos"]),
  fixedBar: z.number().min(0).nullable().optional(),
  currentLoad: z.number().min(0),
  equipmentIncrement: z.number().min(0),
  baseRir: z.number().int().min(0).max(5),
  variantOfId: z.string().uuid().nullable().optional(),
  rotationMode: z.enum(["manual", "alternarSemana", "porEstancamiento"]).optional(),
  activeVariantId: z.string().uuid().nullable().optional(),
};

export const routineExerciseSchema = z
  .object({ routineId: z.string().uuid(), ...routineExerciseFields })
  .refine((d) => d.minReps <= d.maxReps, {
    message: "minReps no puede ser mayor que maxReps",
    path: ["minReps"],
  });

export const routineExerciseUpdateSchema = z
  .object(routineExerciseFields)
  .partial()
  .refine((d) => Object.keys(d).length > 0, "Nada que actualizar");

export const methodConfigSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    blockLength: z.number().int().min(2).max(20).optional(),
    rirPerWeek: z.array(z.number().int().min(0).max(5)).optional(),
    deloadVolumePct: z.number().min(0.1).max(1).optional(),
    failureRules: z
      .object({
        semanasFalloSeguidas: z.number().int().min(1),
        ajustePct: z.number().min(-50).max(0),
      })
      .optional(),
    progressionStyle: z.enum(["doble", "lineal", "libre"]).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "Nada que actualizar");
