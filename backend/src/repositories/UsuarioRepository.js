import pool from "../config/database.js";
import Usuario from "../models/Usuario.js";

class UsuarioRepository {
  async findByIdentifier(identifier) {
    const sql = identifier.includes("@")
      ? `SELECT * FROM usuarios WHERE email = $1`
      : `SELECT * FROM usuarios WHERE usuario = $1`;

    const result = await pool.query(sql, [identifier]);
    if (result.rows.length === 0) {
      return null;
    }
    return new Usuario(result.rows[0]);
  }
}

export default new UsuarioRepository();
