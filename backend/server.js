const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const products = [
    {
      id: 1,
      name: "hamburCHIKIguesa",
      price: 25,
    },{
      id: 2,
      name: "pizza",
      price: 15,
    },{
      id: 3,
      name: "salchipapa",
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

app.get("/api/productos", (req, res) => {
  res.json(products);
})

app.listen(3000, () => {
  console.log("Servidor funcionando en el puerto 3000");
});
