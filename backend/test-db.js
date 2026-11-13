const pool = require("./db");

async function test() {   
  // 1. haz la consulta con: await pool.query("SELECT * FROM products")
  const result = await pool.query("SELECT * FROM products")
  // 2. imprime result.rows con console.log
  console.log(result.rows);
  // 3. cierra el pool con: await pool.end()
  await pool.end();
}

test();