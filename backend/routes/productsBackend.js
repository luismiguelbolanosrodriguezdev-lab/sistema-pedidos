const express = require("express");
const pool = require("../db");

const router = express.Router();

const BUSINESS_ID = 1; // TODO: saldrá del usuario cuando haya login

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

function isValidProduct(name, price) {
  return (
    typeof name === "string" &&
    name.trim() !== "" &&
    Number.isInteger(price) &&
    price > 0
  );
}

router.get("/", async (req, res) => {
    const includeInactive = req.query.includeInactive === "true";

  const sql = includeInactive
    ? "SELECT id, name, price, is_active FROM products WHERE business_id = $1 ORDER BY id"
    : "SELECT id, name, price, is_active FROM products WHERE business_id = $1 AND is_active = TRUE ORDER BY id";

  try {
    const result = await pool.query(sql, [1]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.post("/", async (req, res) => {
  const { name, price } = req.body ?? {};

  if (!isValidProduct(name, price)) {
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

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price } = req.body ?? {};

  if (!isValidProduct(name, price) || !isValidId(id)) {
    return res.status(400).json({ error: "Nombre, precio o id no válidos" });
  }

  const cleanName = name.trim();

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, updated_at = now() WHERE id = $3 AND business_id = $4 RETURNING id, name, price",
      [cleanName, price, id, BUSINESS_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
 });

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { is_active } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0 || typeof is_active !== "boolean"){
   return res.status(400).json({error: "id o is_active no validos"}) 
  }

  try {
    const result = await pool.query(
      "UPDATE products SET is_active = $1, updated_at = now() WHERE id = $2 AND business_id = $3 RETURNING id, name, price, is_active",
      [is_active, id, BUSINESS_ID],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al Desactivar o Activar el producto" });
  }
 });


module.exports = router;