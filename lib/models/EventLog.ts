import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db";

export type EventType = "gymChange" | "blockStart" | "routineChange" | "other";

/**
 * Hito en el historial (cambio de gimnasio, inicio de bloque, cambio de rutina)
 * que se marca como línea de referencia en las gráficas de progreso.
 */
export class EventLog extends Model<
  InferAttributes<EventLog>,
  InferCreationAttributes<EventLog>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare date: string;
  declare type: CreationOptional<EventType>;
  declare note: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EventLog.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "other",
    },
    note: {
      type: DataTypes.TEXT,
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
    modelName: "EventLog",
    tableName: "event_logs",
  },
);
