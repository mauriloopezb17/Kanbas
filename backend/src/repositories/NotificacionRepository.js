import { pool } from "../config/database.js";

class NotificacionRepository {
  async crearNotificacion({ titulo, contenido, idUsuarioEmisor }) {
    const result = await pool.query(
      `INSERT INTO notificaciones (titulo, contenido, fecha, idusuario_emisor)
       VALUES ($1, $2, NOW(), $3)
       RETURNING *`,
      [titulo, contenido, idUsuarioEmisor]
    );

    return result.rows[0];
  }

  async agregarDestinatario(idNotificacion, idUsuario) {
    await pool.query(
      `INSERT INTO destinatarios (idusuario, idnotificacion)
       VALUES ($1, $2)`,
      [idUsuario, idNotificacion]
    );
  }

  async getResponsablesProyecto(idProyecto) {
    const result = await pool.query(
      `SELECT idusuario_po, idusuario_srm, nombreproyecto
       FROM proyectos
       WHERE idproyecto = $1`,
      [idProyecto]
    );

    if (result.rowCount === 0) return null;
    return result.rows[0];
  }

  async getNotificacionesUsuario(idUsuario) {
    const result = await pool.query(
      `SELECT n.idnotificacion, n.titulo, n.contenido, n.fecha, n.idusuario_emisor
     FROM notificaciones n
     JOIN destinatarios d ON d.idnotificacion = n.idnotificacion
     WHERE d.idusuario = $1
     ORDER BY n.fecha DESC`,
      [idUsuario]
    );

    return result.rows;
  }
}

export default new NotificacionRepository();
