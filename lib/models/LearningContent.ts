import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

export type Nivel = "principiante" | "intermedio" | "avanzado";
export type ContentType = "termino" | "articulo";

/**
 * Contenido del apartado /aprender: términos del glosario y artículos
 * por level. `contenido` es markdown. `lang` permite futuras traducciones.
 */
export class LearningContent extends Model<
  InferAttributes<LearningContent>,
  InferCreationAttributes<LearningContent>
> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare title: string;
  declare level: CreationOptional<Nivel>;
  declare type: CreationOptional<ContentType>;
  declare category: CreationOptional<string>;
  declare content: string;
  declare order: CreationOptional<number>;
  declare lang: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LearningContent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "principiante",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "articulo",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "es",
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
    modelName: "LearningContent",
    tableName: "learning_contents",
  },
);
