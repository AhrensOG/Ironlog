import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { MethodConfig } from "./MethodConfig";
import type { RoutineExercise } from "./RoutineExercise";

/**
 * Versión de rutina. Cada cambio relevante (nuevo bloque, cambio de gimnasio)
 * puede crear una nueva versión con su date de inicio, preservando el historial.
 */
export class Routine extends Model<
  InferAttributes<Routine>,
  InferCreationAttributes<Routine>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare methodConfigId: string;
  declare name: string;
  declare isActive: CreationOptional<boolean>;
  declare startDate: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare methodConfig?: NonAttribute<MethodConfig>;
  declare exercises?: NonAttribute<RoutineExercise[]>;
}

Routine.init(
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
    methodConfigId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
    modelName: "Routine",
    tableName: "routines",
  },
);
