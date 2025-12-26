const express = require("express");
const pool = require("../db");

const router = express.Router();

// LISTAR (con filtros opcionales)
router.get("/tareas", async (req, res) => {
  const { materia, estado } = req.query;

  const where = [];
  const params = [];

  if (materia) { where.push("materia = ?"); params.push(materia); }
  if (estado)  { where.push("estado = ?");  params.push(estado);  }

  const sql = `SELECT * FROM tareas ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC`;
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post("/tareas", async (req, res) => {
  const { materia, titulo, descripcion } = req.body;
  if (!materia || !titulo) return res.status(400).json({ error: "materia y titulo son obligatorios" });

  const [r] = await pool.query(
    "INSERT INTO tareas (materia, titulo, descripcion) VALUES (?,?,?)",
    [materia.trim(), titulo.trim(), (descripcion || "").trim() || null]
  );
  res.status(201).json({ id: r.insertId });
});

router.put("/tareas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { materia, titulo, descripcion, estado } = req.body;

  const [r] = await pool.query(
    `UPDATE tareas
     SET materia = ?, titulo = ?, descripcion = ?, estado = ?
     WHERE id = ?`,
    [materia, titulo, descripcion || null, estado, id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: "No existe" });
  res.json({ ok: true });
});

router.delete("/tareas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [r] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: "No existe" });
  res.json({ ok: true });
});

module.exports = router;
