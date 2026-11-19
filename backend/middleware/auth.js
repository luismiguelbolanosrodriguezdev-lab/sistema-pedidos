const jwt = require("jsonwebtoken");
const pool = require("../db");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token){
    return res.status(401).json({ error: "Sesión requerida"})
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    return res.status(401).json({error: "Sesión inválida o vencida"})
  }

  const id = Number(payload.sub);
  if (!Number.isInteger(id)){
    return res.status(401).json({error: "Sesión inválida o vencida"});
  }

  try {
    const result = await pool.query(
      "SELECT id, business_id, name, email, role, is_active FROM users WHERE id = $1",
      [id],
    );
    const user = result.rows[0];
    // 3. si !user o !user.is_active: 401
    if (!user || !user.is_active){
        return res.status(401).json({error: "Sesión inválida o vencida"});
    }
    req.user = {
        id: user.id,
        businessId: user.business_id,
        name: user.name,
        email: user.email,
        role: user.role };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error del servidor"});
  }
}

function requireRole(...roles){
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)){
        return res.status(403).json({error: "No tienes permiso para esta acción"})
        }
        next()
    }
}

module.exports = { requireAuth, requireRole};