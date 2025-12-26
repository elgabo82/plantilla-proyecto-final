require("dotenv").config();
const path = require("path");
const express = require("express");

const apiRouter = require("./routes/api");

const app = express();
app.disable("x-powered-by");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api", apiRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 3000);
let SRV = process.env.SERVER || "localhost";
SRV = "http://" + SRV;

app.listen(port, () => {
  console.log(`Servidor en ${SRV}:${port}`);
});
