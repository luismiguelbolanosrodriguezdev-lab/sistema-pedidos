const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());


app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});

app.get("/api/productos", (req, res) => {
  const productos = [
    {
      id: 1,
      nombre: "hamburguesa",
      precio: 25,
    },{
      id: 2,
      nombre: "pizza",
      precio: 15,
    },{
      id: 3,
      nombre: "salchipapa",
      precio: 20,
    }
  ]
  res.json(productos);
})

app.listen(3000, () => {
  console.log("Servidor funcionando en el puerto 3000");
});