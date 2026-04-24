const pool = require("./db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conectado:", res.rows);
  } catch (err) {
    console.error("Erro:", err);
  }
}

testConnection();