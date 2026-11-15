const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
app.use(cors());
app.use(express.json());

app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, price FROM products WHERE is_active = TRUE ORDER BY id;",
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

app.post("/api/productos", async (req, res) => {
  const { name, price } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    !Number.isInteger(price) ||
    price <= 0
  ) {
    return res.status(400).json({ error: "Nombre o precio no válidos" });
  }
  const cleanName = name.trim();

  try {
    const result = await pool.query(
      "INSERT INTO products (business_id, name, price) VALUES ($1, $2, $3) RETURNING id, name, price",
      [1, cleanName, price],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

app.put("/api/productos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    !Number.isInteger(price) ||
    price <= 0 ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({ error: "Nombre, precio o id no válidos" });
  }

  const cleanName = name.trim();

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, updated_at = now() WHERE id = $3 AND business_id = $4 RETURNING id, name, price",
      [cleanName, price, id, 1],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en el puerto 3000");
});

app.get("/hola", (req, res) => {
  res.send("Servidor activo");
});
