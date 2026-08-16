import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { SessionLog } from "./SessionLog";

/**
 * Sesión de entrenamiento de un día. `routineDay` indica qué día de la rutina
 * se entrenó (puede no coincidir con el día de la week real).
 */
export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare trainingBlockId: string | null;
  declare date: string;
  declare routineDay: number | null;
  declare isRest: CreationOptional<boolean>;
  declare notes: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare logs?: NonAttribute<SessionLog[]>;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    trainingBlockId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    routineDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1 = Lunes ... 7 = Domingo (de la rutina)",
    },
    isRest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
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
    modelName: "Session",
    tableName: "sessions",
    indexes: [{ unique: true, fields: ["user_id", "date"] }],
  },
);
