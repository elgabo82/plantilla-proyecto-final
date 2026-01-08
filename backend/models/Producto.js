const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Producto = sequelize.define("Producto", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
  },
});

module.exports = Producto;