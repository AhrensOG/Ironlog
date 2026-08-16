import {
  DataTypes,
  Model,
  NonAttribute,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";
import type { RoutineExercise } from "./RoutineExercise";

/**
 * Test AMRAP de la week de descarga. e1RM se calcula con la fórmula de
 * Epley: 1RM ≈ weight × (1 + reps/30).
 */
export class AmrapTest extends Model<
  InferAttributes<AmrapTest>,
  InferCreationAttributes<AmrapTest>
> {
  declare id: CreationOptional<string>;
  declare trainingBlockId: string;
  declare routineExerciseId: string;
  declare weight: number;
  declare reps: number;
  declare e1rm: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare routineExercise?: NonAttribute<RoutineExercise>;
}

AmrapTest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trainingBlockId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    routineExerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    e1rm: {
      type: DataTypes.FLOAT,
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
    modelName: "AmrapTest",
    tableName: "amrap_tests",
  },
);
