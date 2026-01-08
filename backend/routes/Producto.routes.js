const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");


router.post("/productos", async (req, res) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/productos", async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});


router.put("/productos/:id", async (req, res) => {
  try {
    await Producto.update(req.body, { where: { id: req.params.id } });
    res.json({ mensaje: "Actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/productos/:id", async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: "Eliminado" });
});

module.exports = { router };