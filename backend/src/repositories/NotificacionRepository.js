import { pool } from "../config/database.js";
import Notificacion from "../models/Notificacion.js";

class NotificacionRepository {
  async createNotificacion({ titulo, contenido, idUsuarioEmisor }) {
    const result = await pool.query(
      `INSERT INTO notificaciones(titulo, contenido, fecha, idusuario_emisor)
             VALUES ($1, $2, NOW(), $3)
             RETURNING *`,
      [titulo, contenido, idUsuarioEmisor]
    );

    return new Notificacion(result.rows[0]);
  }

  async addDestinatario(idNotificacion, idUsuario) {
    await pool.query(
      `INSERT INTO destinatarios(idusuario, idnotificacion)
             VALUES ($1, $2)`,
      [idUsuario, idNotificacion]
    );
  }

  async getNotificacionesRecibidas(idUsuario) {
    const result = await pool.query(
      `SELECT n.* 
             FROM destinatarios d
             JOIN notificaciones n ON n.idnotificacion = d.idnotificacion
             WHERE d.idusuario = $1`,
      [idUsuario]
    );

    return result.rows.map((row) => new Notificacion(row));
  }
}

export default new NotificacionRepository();
