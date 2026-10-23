const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Servidor activo");
});

app.listen(3000, () => {
  console.log("Servidor funcionando en el puerto 3000");
});