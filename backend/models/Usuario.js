const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  }
);

module.exports = { Usuario };
