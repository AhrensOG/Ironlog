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
import type { MuscleGroup } from "./MuscleGroup";

export type WeightType = "total" | "porLado" | "barraDiscos";
export type RotationMode = "manual" | "alternarSemana" | "porEstancamiento";

/**
 * Ejercicio de una rutina. La load y el increment se expresan en la unidad
 * que corresponda según `weightType`:
 * - total:       kg totales cargados (poleas, máquinas)
 * - porLado:     kg por mancuerna (total = 2 × lado)
 * - barraDiscos: bar fija + discos por lado (total = fixedBar + 2 × lado)
 */
export class RoutineExercise extends Model<
  InferAttributes<RoutineExercise>,
  InferCreationAttributes<RoutineExercise>
> {
  declare id: CreationOptional<string>;
  declare routineId: string;
  declare muscleGroupId: string;
  declare weekday: number;
  declare name: string;
  declare order: CreationOptional<number>;
  declare sets: CreationOptional<number>;
  declare minReps: number;
  declare maxReps: number;
  declare weightType: CreationOptional<WeightType>;
  declare fixedBar: number | null;
  declare currentLoad: CreationOptional<number>;
  declare equipmentIncrement: CreationOptional<number>;
  declare baseRir: CreationOptional<number>;
  /**
   * Grupo de variants: si es null, este ejercicio es un contenedor normal o
   * parent. Si apunta a otro ejercicio, es una variante de ese group.
   * Cada variante conserva su propia load, historial y progresión.
   */
  declare variantOfId: string | null;
  declare rotationMode: CreationOptional<RotationMode>;
  declare activeVariantId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare routine?: NonAttribute<Routine>;
  declare muscleGroup?: NonAttribute<MuscleGroup>;
  declare varianteDe?: NonAttribute<RoutineExercise>;
  declare variants?: NonAttribute<RoutineExercise[]>;
}

RoutineExercise.init(
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
    muscleGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    weekday: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 = Lunes ... 7 = Domingo",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    minReps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxReps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "total",
    },
    fixedBar: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currentLoad: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    equipmentIncrement: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 2.5,
    },
    baseRir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    variantOfId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    rotationMode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "manual",
    },
    activeVariantId: {
      type: DataTypes.UUID,
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
    modelName: "RoutineExercise",
    tableName: "routine_exercises",
  },
);
