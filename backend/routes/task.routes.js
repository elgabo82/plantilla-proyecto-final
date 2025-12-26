const express = require("express");
const { Task } = require("../models/Task");

const router = express.Router();

// GET /api/v1/tasks
router.get("/tasks", async (req, res) => {
  const items = await Task.findAll({ order: [["id", "DESC"]] });
  res.json(items);
});

// GET /api/v1/tasks/:id
router.get("/tasks/:id", async (req, res) => {
  const item = await Task.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "No existe" });
  res.json(item);
});

// POST /api/v1/tasks
router.post("/tasks", async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || String(title).trim().length < 3) {
    return res.status(400).json({ message: "title es requerido (mín. 3 caracteres)" });
  }

  const item = await Task.create({
    title: String(title).trim(),
    description: description ? String(description).trim() : null,
    status: status || "PENDIENTE"
  });

  res.status(201).json(item);
});

// PUT /api/v1/tasks/:id
router.put("/tasks/:id", async (req, res) => {
  const item = await Task.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "No existe" });

  const { title, description, status } = req.body;

  if (title !== undefined) {
    if (!String(title).trim() || String(title).trim().length < 3) {
      return res.status(400).json({ message: "title inválido (mín. 3 caracteres)" });
    }
    item.title = String(title).trim();
  }

  if (description !== undefined) {
    item.description = description ? String(description).trim() : null;
  }

  if (status !== undefined) {
    const allowed = ["PENDIENTE", "EN_PROGRESO", "HECHA"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "status inválido" });
    }
    item.status = status;
  }

  await item.save();
  res.json(item);
});

// DELETE /api/v1/tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  const item = await Task.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "No existe" });

  await item.destroy();
  res.json({ message: "Eliminado" });
});

module.exports = { router };
