import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

/**
 * Rango de sets duras/week recomendado por group muscular (MEV/MAV/MRV),
 * tomado de la literatura de hipertrofia (Schoenfeld, Krieger, Pelland et al.)
 */
export class MuscleGroup extends Model<
  InferAttributes<MuscleGroup>,
  InferCreationAttributes<MuscleGroup>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare minReps: number;
  declare maxReps: number;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MuscleGroup.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    minReps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxReps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    modelName: "MuscleGroup",
    tableName: "muscle_groups",
  },
);
