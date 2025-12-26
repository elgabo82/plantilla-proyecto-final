const express = require("express");
require("dotenv").config();

const { sequelize } = require("./db/db");
require("./models/Task"); // registra el modelo antes de sync()

const { router: taskRoutes } = require("./routes/task.routes");

const app = express();
app.use(express.json());

// API versionada
app.get("/api/v1/estado", (req, res) => res.json({ ok: true, version: "v1" }));
app.use("/api/v1", taskRoutes);

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
    app.listen(PORT, () => console.log(`🚀 API lista en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error de arranque:", err.message);
    process.exit(1);
  }
}

bootstrap();
