const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const productos = [
    {
      id: 1,
      nombre: "hamburCHIKIguesa",
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

app.post("/api/productos", (req, res) => {
  const {nombre, precio} = req.body;

  if(!nombre || !precio){
   return res.status(400).json({error: "Rellna los campos"})
  }

const nuevoProducto = {
  id: productos.length + 1,
  nombre: nombre,
  precio: precio,
}
productos.push(nuevoProducto);
res.status(201).json(nuevoProducto);
})


app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});

app.get("/api/productos", (req, res) => {
  res.json(productos);
})

app.listen(3000, () => {
  console.log("Servidor funcionando en el puerto 3000");
});