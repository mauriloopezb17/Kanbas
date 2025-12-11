import { pool } from "../config/database.js";

class IntegrantesRepository {
  async addIntegrante(idEquipo, idUsuario) {
    const result = await pool.query(
      `INSERT INTO integrantes(idequipo, idusuario)
             VALUES($1, $2)
             RETURNING *`,
      [idEquipo, idUsuario]
    );

    return result.rows[0];
  }

  async getIntegrantes(idEquipo) {
    const result = await pool.query(
      `SELECT 
          i.idintegrante,
          u.idusuario,
          u.nombre,
          u.apellido,
          u.email,
          u.usuario
       FROM integrantes i
       JOIN usuarios u ON u.idusuario = i.idusuario
       WHERE i.idequipo = $1`,
      [idEquipo]
    );

    return result.rows;
  }
}

export default new IntegrantesRepository();
