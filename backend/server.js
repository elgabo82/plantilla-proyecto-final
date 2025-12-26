const express = require("express");
require("dotenv").config();

const { sequelize } = require("./db/db");
require("./models/Task"); // registra el modelo antes de sync()

const { router: taskRoutes } = require("./routes/task.routes");

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// API versionada
app.get("/api/v1/estado", (req, res) => res.json({ ok: true, version: "v1" }));
app.use("/api/v1", taskRoutes);

// Opcional: evitar caché en dev (muy útil)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// 404 API
app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("✅ MariaDB conectada");

    // Crea tablas si NO existen
    await sequelize.sync();
    console.log("✅ Tablas creadas/verificadas (sync)");

    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 API lista en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error de arranque:", err.message);
    process.exit(1);
  }
}

bootstrap();
