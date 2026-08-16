import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

export type ProgressionStyle = "doble" | "lineal" | "libre";

export interface FailureRules {
  semanasFalloSeguidas: number;
  ajustePct: number;
}

/**
 * Metodología de entrenamiento parametrizada por usuario.
 * Plantilla por defecto: bloques de 6 semanas con RIR 3,3,2,2,1,1 y
 * week 7 de descarga (60% volumen) + test AMRAP.
 */
export class MethodConfig extends Model<
  InferAttributes<MethodConfig>,
  InferCreationAttributes<MethodConfig>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare name: string;
  declare blockLength: CreationOptional<number>;
  declare rirPerWeek: CreationOptional<number[]>;
  declare deloadVolumePct: CreationOptional<number>;
  declare failureRules: CreationOptional<FailureRules>;
  declare progressionStyle: CreationOptional<ProgressionStyle>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MethodConfig.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
    },
    rirPerWeek: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [3, 3, 2, 2, 1, 1],
    },
    deloadVolumePct: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.6,
    },
    failureRules: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { semanasFalloSeguidas: 2, ajustePct: -5 },
    },
    progressionStyle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "doble",
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
    modelName: "MethodConfig",
    tableName: "method_configs",
  },
);
