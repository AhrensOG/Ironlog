import { sequelize } from "../db";
import { User } from "./User";
import { MuscleGroup } from "./MuscleGroup";
import { MethodConfig } from "./MethodConfig";
import { Routine } from "./Routine";
import { RoutineExercise } from "./RoutineExercise";
import { TrainingBlock } from "./TrainingBlock";
import { Session } from "./Session";
import { SessionLog } from "./SessionLog";
import { AmrapTest } from "./AmrapTest";
import { BodyWeight } from "./BodyWeight";
import { EventLog } from "./EventLog";
import { LearningContent } from "./LearningContent";
import { RoutineTemplate } from "./RoutineTemplate";
import { ExerciseCatalog } from "./ExerciseCatalog";
import type { Model, ModelStatic } from "sequelize";

// ── Associations (centralized to avoid import cycles) ──
// Guarded: on hot reload, index.ts may re-evaluate while sibling model
// classes were not invalidated, so associations must be idempotent.

function assoc<M extends ModelStatic<Model>, T extends ModelStatic<Model>>(
  source: M,
  method: "belongsTo" | "hasMany" | "hasOne",
  target: T,
  options: { foreignKey: string; as: string },
) {
  const existing = (source as unknown as { associations?: Record<string, unknown> })
    .associations;
  if (existing && Object.prototype.hasOwnProperty.call(existing, options.as)) {
    return;
  }
  source[method](target, options);
}

assoc(MethodConfig, "belongsTo", User, { foreignKey: "userId", as: "user" });
assoc(User, "hasMany", MethodConfig, { foreignKey: "userId", as: "methodConfigs" });

assoc(Routine, "belongsTo", User, { foreignKey: "userId", as: "user" });
assoc(Routine, "belongsTo", MethodConfig, { foreignKey: "methodConfigId", as: "methodConfig" });
assoc(User, "hasMany", Routine, { foreignKey: "userId", as: "routines" });

assoc(RoutineExercise, "belongsTo", Routine, { foreignKey: "routineId", as: "routine" });
assoc(RoutineExercise, "belongsTo", MuscleGroup, { foreignKey: "muscleGroupId", as: "muscleGroup" });
assoc(Routine, "hasMany", RoutineExercise, { foreignKey: "routineId", as: "exercises" });
assoc(MuscleGroup, "hasMany", RoutineExercise, { foreignKey: "muscleGroupId", as: "exercises" });

assoc(RoutineExercise, "belongsTo", RoutineExercise, { foreignKey: "variantOfId", as: "varianteDe" });
assoc(RoutineExercise, "hasMany", RoutineExercise, { foreignKey: "variantOfId", as: "variantes" });

assoc(TrainingBlock, "belongsTo", Routine, { foreignKey: "routineId", as: "routine" });
assoc(Routine, "hasMany", TrainingBlock, { foreignKey: "routineId", as: "blocks" });

assoc(Session, "belongsTo", User, { foreignKey: "userId", as: "user" });
assoc(Session, "belongsTo", TrainingBlock, { foreignKey: "trainingBlockId", as: "trainingBlock" });
assoc(User, "hasMany", Session, { foreignKey: "userId", as: "sessions" });
assoc(TrainingBlock, "hasMany", Session, { foreignKey: "trainingBlockId", as: "sessions" });

assoc(SessionLog, "belongsTo", Session, { foreignKey: "sessionId", as: "session" });
assoc(SessionLog, "belongsTo", RoutineExercise, { foreignKey: "routineExerciseId", as: "routineExercise" });
assoc(Session, "hasMany", SessionLog, { foreignKey: "sessionId", as: "logs" });
assoc(RoutineExercise, "hasMany", SessionLog, { foreignKey: "routineExerciseId", as: "logs" });

assoc(AmrapTest, "belongsTo", TrainingBlock, { foreignKey: "trainingBlockId", as: "trainingBlock" });
assoc(AmrapTest, "belongsTo", RoutineExercise, { foreignKey: "routineExerciseId", as: "routineExercise" });
assoc(TrainingBlock, "hasMany", AmrapTest, { foreignKey: "trainingBlockId", as: "amrapTests" });

assoc(BodyWeight, "belongsTo", User, { foreignKey: "userId", as: "user" });
assoc(User, "hasMany", BodyWeight, { foreignKey: "userId", as: "bodyWeights" });

assoc(EventLog, "belongsTo", User, { foreignKey: "userId", as: "user" });
assoc(User, "hasMany", EventLog, { foreignKey: "userId", as: "events" });

assoc(ExerciseCatalog, "belongsTo", MuscleGroup, { foreignKey: "muscleGroupId", as: "muscleGroup" });
assoc(MuscleGroup, "hasMany", ExerciseCatalog, { foreignKey: "muscleGroupId", as: "catalogo" });

export {
  User,
  MuscleGroup,
  MethodConfig,
  Routine,
  RoutineExercise,
  TrainingBlock,
  Session,
  SessionLog,
  AmrapTest,
  BodyWeight,
  EventLog,
  LearningContent,
  RoutineTemplate,
  ExerciseCatalog,
};

export async function syncDatabase(opts: { alter?: boolean } = {}) {
  await sequelize.sync({ alter: opts.alter ?? false });
}

export { sequelize };
