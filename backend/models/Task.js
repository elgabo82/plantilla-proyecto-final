const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    status: {
      type: DataTypes.ENUM("PENDIENTE", "EN_PROGRESO", "HECHA"),
      allowNull: false,
      defaultValue: "PENDIENTE"
    }
  },
  {
    tableName: "tasks",
    timestamps: true
  }
);

module.exports = { Task };
