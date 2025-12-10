import pool from "../config/database.js";

class MensajeRepository {
  async createMensaje(idUsuarioEmisor, contenido) {
    const result = await pool.query(
      `INSERT INTO mensajes(idusuario_emisor, contenido, fecha)
             VALUES ($1, $2, NOW())
             RETURNING *`,
      [idUsuarioEmisor, contenido]
    );

    return result.rows[0];
  }

  async addReceptor(idMensaje, idUsuarioReceptor) {
    await pool.query(
      `INSERT INTO mensajes_usuarios(idmensaje, idusuarioreceptor)
             VALUES ($1, $2)`,
      [idMensaje, idUsuarioReceptor]
    );
  }

  async getMensajesParaUsuario(idUsuario) {
    const result = await pool.query(
      `SELECT m.*
             FROM mensajes_usuarios mu
             JOIN mensajes m ON m.idmensaje = mu.idmensaje
             WHERE mu.idusuarioreceptor = $1`,
      [idUsuario]
    );

    return result.rows;
  }
}

export default new MensajeRepository();
