import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { Routine } from "./Routine";

/**
 * Bloque de entrenamiento (ciclo). Por defecto 6 semanas + week de descarga
 * (la 7ª), que se deriva de `MethodConfig.blockLength`.
 */
export class TrainingBlock extends Model<
  InferAttributes<TrainingBlock>,
  InferCreationAttributes<TrainingBlock>
> {
  declare id: CreationOptional<string>;
  declare routineId: string;
  declare number: CreationOptional<number>;
  declare startDate: string;
  declare status: CreationOptional<"active" | "closed">;
  declare closedAt: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare routine?: NonAttribute<Routine>;
}

TrainingBlock.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    routineId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    closedAt: {
      type: DataTypes.DATEONLY,
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
    modelName: "TrainingBlock",
    tableName: "training_blocks",
  },
);
