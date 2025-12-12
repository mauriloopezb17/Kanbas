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

  async eliminarIntegrante(idIntegrante) {
    const result = await pool.query(
      `DELETE FROM integrantes
     WHERE idintegrante = $1
     RETURNING *`,
      [idIntegrante]
    );

    return result.rows[0];
  }
  async findEquipoByUsuarioAndProyecto(idUsuario, idProyecto) {
    const result = await pool.query(
      `SELECT i.idequipo 
       FROM integrantes i
       JOIN equipos e ON e.idequipo = i.idequipo
       WHERE i.idusuario = $1 AND e.idproyecto = $2`,
      [idUsuario, idProyecto]
    );

    if (result.rowCount === 0) return null;
    return result.rows[0];
  }
}

export default new IntegrantesRepository();
