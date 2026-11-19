require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/productsBackend");
const authRouter = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/productos", productsRouter);

app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});

app.listen(3000, () => {
  console.log("Servidor activo en el puerto 3000");
});