import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { MuscleGroup } from "./MuscleGroup";
import type { WeightType } from "./RoutineExercise";

/**
 * Catálogo curado de exercises para recomendaciones al crear exercises
 * y variants. Seed en scripts/exercise-catalog.ts.
 */
export class ExerciseCatalog extends Model<
  InferAttributes<ExerciseCatalog>,
  InferCreationAttributes<ExerciseCatalog>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare muscleGroupId: string;
  declare pattern: string;
  declare weightType: WeightType;
  declare description: string | null;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare muscleGroup?: NonAttribute<MuscleGroup>;
}

ExerciseCatalog.init(
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
    muscleGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pattern: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ej. tiro horizontal, empuje vertical, bisagra de cadera...",
    },
    weightType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "total",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "ExerciseCatalog",
    tableName: "exercise_catalog",
  },
);
