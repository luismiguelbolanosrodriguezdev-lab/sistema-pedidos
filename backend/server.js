const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
app.use(cors());
app.use(express.json());

const products = [
    {
      id: 1,
      name: "Fresas Tradicionales",
      price: 25,
    },{
      id: 2,
      name: "Fresas especiales",
      price: 15,
    },{
      id: 3,
      name: "Fresas con chocolate",
      price: 20,
    }
  ]

app.post("/api/productos", (req, res) => {
  const {name, price} = req.body;

  if(!name || !price){
   return res.status(400).json({error: "Rellena los campos"})
  }

const newProduct = {
  id: products.length + 1,
  name: name,
  price: price,
}
products.push(newProduct);
res.status(201).json(newProduct);
})


app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});

app.get("/api/productos", async (req, res) => {
  try{
    const result = await pool.query("SELECT id, name, price FROM products WHERE is_active = TRUE;");
    res.json(result.rows);
    console.log(result.rows);
  } catch(error){
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
})

app.listen(3000, () => {
  console.log("Servidor activo en el puerto 3000");
});
