const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

function isValidRegister(businessName, ownerName, email, password) {
  return (
    typeof businessName === "string" &&
    businessName.trim() !== "" &&
    businessName.trim().length <= 100 &&
    typeof ownerName === "string" &&
    ownerName.trim() !== "" &&
    ownerName.trim().length <= 100 &&
    typeof email === "string" &&
    email.trim().toLocaleLowerCase() !== "" &&
    /^\S+@\S+\.\S+$/.test(email) &&
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 72
  );
}

router.post("/register", async (req, res) => {
  const { businessName, ownerName, email, password } = req.body ?? {};

  if (!isValidRegister(businessName, ownerName, email, password)) {
    return res
      .status(400)
      .json({ error: "Los datos ingresados no son válidos" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanBusinessName = businessName.trim();
  const cleanOwnerName = ownerName.trim();

  const passwordHash = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const businessResult = await client.query(
      "INSERT INTO businesses (name) VALUES ($1) RETURNING id",
      [cleanBusinessName],
    );
    const businessId = businessResult.rows[0].id;

    const clientresult = await client.query(
      "INSERT INTO users (business_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [businessId, cleanOwnerName, cleanEmail, passwordHash, "owner"],
    );
    await client.query("COMMIT");
    console.log("Usuario registrado exitosamente:");
    res.status(201).json(clientresult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      console.error("Error al registrar el usuario: correo repetido");
      res.status(409).json({ error: "Credenciales Inválidas" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  } finally {
    client.release();
  }
});

module.exports = router;