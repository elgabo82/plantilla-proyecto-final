const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./db/db");


require("./models/Task");
const Producto = require("./models/Producto"); 


const { router: taskRoutes } = require("./routes/task.routes");
const { router: productoRoutes } = require("./routes/producto.routes"); 

const app = express();

const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false 
};


app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());


app.get("/api/v1/health", (req, res) => res.json({ ok: true, https: true }));


app.use("/api/v1", taskRoutes);
app.use("/api/v1", productoRoutes); 

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));


async function seedDatabase() {
  const count = await Producto.count();
  if (count === 0) {
    console.log("🎮 Insertando productos de VR iniciales...");
    await Producto.bulkCreate([
      { nombre: "Meta Quest 3 128GB", cantidad: 8, precio: 499.99, categoria: "Realidad Virtual" },
      { nombre: "PlayStation 5 Slim", cantidad: 12, precio: 449.00, categoria: "Consolas" },
      { nombre: "Valve Index Full Kit", cantidad: 3, precio: 999.00, categoria: "Realidad Virtual" },
      { nombre: "Control DualSense Edge", cantidad: 25, precio: 199.99, categoria: "Accesorios" },
      { nombre: "Cable Link VR 5m", cantidad: 100, precio: 79.99, categoria: "Cables/PCVR" },
      { nombre: "Nintendo Switch OLED", cantidad: 15, precio: 349.00, categoria: "Consolas" },
      { nombre: "Base Lighthouse 2.0", cantidad: 10, precio: 199.00, categoria: "Sensores VR" }
    ]);
    console.log("✅ Datos de VR cargados correctamente");
  }
}

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log("✅ DB OK, tablas sync");

    await seedDatabase();

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