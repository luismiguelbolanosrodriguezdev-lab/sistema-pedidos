require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/productsBackend");
const authRouter = require("./routes/auth");

const app = express();
app.disable("x-powered-by");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/productos", productsRouter);

app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Datos demasiado grandes" });
  }
  console.error(err);
  res.status(500).json({ error: "Error del servidor" });
});

app.listen(3000, () => {
  console.log("Servidor activo en el puerto 3000");
});