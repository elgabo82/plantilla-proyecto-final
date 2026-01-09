const express = require("express");
const pool = require("../db");

const router = express.Router();

// LISTAR (con filtros opcionales)
router.get("/polls", async (req, res) => {
  const { categoria, estado } = req.query;

  const where = [];
  const params = [];

  if (categoria) { where.push("categoria = ?"); params.push(categoria); }
  if (estado)  { where.push("estado = ?");  params.push(estado);  }

  const sql = `SELECT * FROM encuestas ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC`;
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post("/polls", async (req, res) => {
  const { categoria, pregunta, opciones } = req.body;
  if (!categoria || !pregunta)
    return res.status(400).json({ error: "categoria y pregunta son obligatorios" });

  const [r] = await pool.query(
    "INSERT INTO encuestas (categoria, pregunta, opciones) VALUES (?,?,?)",
    [categoria.trim(), pregunta.trim(), (opciones || "").trim() || null]
  );
  res.status(201).json({ id: r.insertId });
});

router.put("/polls/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { categoria, pregunta, opciones, estado } = req.body;

  const [r] = await pool.query(
    `UPDATE encuestas
     SET categoria = ?, pregunta = ?, opciones = ?, estado = ?
     WHERE id = ?`,
    [categoria, pregunta, opciones || null, estado, id]
  );
  if (r.affectedRows === 0)
    return res.status(404).json({ error: "No existe" });

  res.json({ ok: true });
});

router.delete("/polls/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [r] = await pool.query("DELETE FROM encuestas WHERE id = ?", [id]);
  if (r.affectedRows === 0)
    return res.status(404).json({ error: "No existe" });

  res.json({ ok: true });
});

module.exports = router;
