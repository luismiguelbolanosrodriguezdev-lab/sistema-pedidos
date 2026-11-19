const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const jwt = require("jsonwebtoken");
const { requireAuth }  = require("../middleware/auth");

if (!process.env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

const DUMMY_HASH = bcrypt.hashSync("contraseña-de-relleno", 10);

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
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    email.trim().length <= 254 &&
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

  let client;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    client = await pool.connect();
    await client.query("BEGIN");

    const businessResult = await client.query(
      "INSERT INTO businesses (name) VALUES ($1) RETURNING id",
      [cleanBusinessName],
    );
    const businessId = businessResult.rows[0].id;

    const userResult = await client.query(
      "INSERT INTO users (business_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [businessId, cleanOwnerName, cleanEmail, passwordHash, "owner"],
    );
    await client.query("COMMIT");
    res.status(201).json(userResult.rows[0]);
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    if (error.code === "23505") {
      console.error("Error al registrar el usuario: correo repetido");
      res.status(409).json({ error: "Este correo ya está en uso" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  } finally {
    if (client) client.release();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password === ""
  ) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son obligatorios" });
  }
  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1",
      [cleanEmail],
    );
    const user = result.rows[0];

    const passwordOk = await bcrypt.compare(
      password,
      user ? user.password_hash : DUMMY_HASH,
    );

    if (!user || !user.is_active || !passwordOk) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user});
})


module.exports = router;