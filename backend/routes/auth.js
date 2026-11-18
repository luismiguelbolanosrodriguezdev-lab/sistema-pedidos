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
    password.length > 8 &&
    password.length <= 72
  );
}

router.post("/register", async (req, res) => {
    const { businessName, ownerName, email, password } = req.body ?? {};

    if (!isValidRegister(businessName, ownerName, email, password)) {
    return res.status(400).json({ error: "Los datos ingresados no son válidos" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    
  }catch (error) {
    console.error(error);
  }
  
});

module.exports = router;