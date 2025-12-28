const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
require("dotenv").config();

const { sequelize } = require("./db/db");
require("./models/Task");
const { router: taskRoutes } = require("./routes/task.routes");

const app = express();
app.use(express.json());

// API
app.get("/api/v1/health", (req, res) => res.json({ ok: true, https: true }));
app.use("/api/v1", taskRoutes);

// (Opcional) servir frontend en el mismo puerto
// const FRONTEND_DIR = path.join(__dirname, "..", "..", "..", "frontend");
// app.use(express.static(FRONTEND_DIR));
// app.get("/", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "index.html")));

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ DB OK, tablas sync");

    const PORT = Number(process.env.PORT || 8080);
    const SSL_ENABLED = String(process.env.SSL_ENABLED || "false") === "true";

    if (SSL_ENABLED) {
      const keyPath = path.resolve(process.cwd(), process.env.SSL_KEY_PATH || "ssl/server.key");
      const certPath = path.resolve(process.cwd(), process.env.SSL_CERT_PATH || "ssl/server.crt");

      const httpsServer = https.createServer(
        {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        },
        app
      );

      httpsServer.listen(PORT, () => {
        console.log(`🔐 HTTPS API lista en https://localhost:${PORT}`);
      });
    } else {
      const httpServer = http.createServer(app);
      httpServer.listen(PORT, () => {
        console.log(`🌐 HTTP API lista en http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("❌ Error de arranque:", err.message);
    process.exit(1);
  }
}

bootstrap();
