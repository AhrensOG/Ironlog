import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

/**
 * Control semanal de weight corporal (mismo día/hora, según el protocolo).
 */
export class BodyWeight extends Model<
  InferAttributes<BodyWeight>,
  InferCreationAttributes<BodyWeight>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare date: string;
  declare weight: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BodyWeight.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    weight: {
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
    modelName: "BodyWeight",
    tableName: "body_weights",
    indexes: [{ unique: true, fields: ["user_id", "date"] }],
  },
);
