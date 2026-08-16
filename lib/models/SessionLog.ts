import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { Session } from "./Session";
import type { RoutineExercise } from "./RoutineExercise";

/**
 * Registro real de un ejercicio en una sesión (weight, sets, reps, RIR reales).
 * Serie dura = serie ejecutada a RIR 0-4 (se usa en la auditoría de volumen).
 */
export class SessionLog extends Model<
  InferAttributes<SessionLog>,
  InferCreationAttributes<SessionLog>
> {
  declare id: CreationOptional<string>;
  declare sessionId: string;
  declare routineExerciseId: string;
  declare actualWeight: number;
  declare setsDone: number;
  declare actualReps: number;
  declare rir: number | null;
  declare isPR: CreationOptional<boolean>;
  declare isInjury: CreationOptional<boolean>;
  declare note: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare session?: NonAttribute<Session>;
  declare routineExercise?: NonAttribute<RoutineExercise>;
}

SessionLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    routineExerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    actualWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    setsDone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actualReps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rir: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isPR: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isInjury: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SessionLog",
    tableName: "session_logs",
  },
);
