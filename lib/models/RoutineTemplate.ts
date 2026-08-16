import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

export type TemplateLevel = "principiante" | "intermedio" | "avanzado";

export interface TemplateExercise {
  weekday: number;
  name: string;
  order: number;
  sets: number;
  minReps: number;
  maxReps: number;
  weightType: "total" | "porLado" | "barraDiscos";
  fixedBar: number | null;
  currentLoad: number;
  equipmentIncrement: number;
  baseRir: number;
  muscleGroup: string;
}

export interface TemplateMethodConfig {
  name: string;
  blockLength: number;
  rirPerWeek: number[];
  deloadVolumePct: number;
  failureRules: { semanasFalloSeguidas: number; ajustePct: number };
  progressionStyle: "doble" | "lineal" | "libre";
}

export interface TemplateContent {
  methodConfig: TemplateMethodConfig;
  exercises: TemplateExercise[];
}

/**
 * Plantilla de rutina: snapshot inmutable de una metodología + exercises.
 * Las del sistema (isSeed) son curadas; las personales pertenecen a authorId.
 * Instanciar una plantilla copia su content a Routine/MethodConfig del usuario.
 */
export class RoutineTemplate extends Model<
  InferAttributes<RoutineTemplate>,
  InferCreationAttributes<RoutineTemplate>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare level: TemplateLevel;
  declare tags: string[];
  declare articles: string[];
  declare authorId: string | null;
  declare isPublic: CreationOptional<boolean>;
  declare isSeed: CreationOptional<boolean>;
  declare activations: CreationOptional<number>;
  declare content: TemplateContent;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RoutineTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "principiante",
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    articles: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isSeed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    activations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.JSONB,
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
    modelName: "RoutineTemplate",
    tableName: "routine_templates",
  },
);
