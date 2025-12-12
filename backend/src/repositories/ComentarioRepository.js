import { pool } from "../config/database.js";
import Comentario from "../models/Comentario.js";

class ComentarioRepository {
  async findByTarea(idTarea) {
    const result = await pool.query(
      `SELECT * FROM comentarios WHERE idtarea = $1 ORDER BY fecha ASC`,
      [idTarea]
    );
    return result.rows.map((row) => new Comentario(row));
  }

  async create({ contenido, fecha, idTarea, idUsuario }) {
    const result = await pool.query(
      `INSERT INTO comentarios(contenido, fecha, idtarea, idusuario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [contenido, fecha, idTarea, idUsuario]
    );

    return new Comentario(result.rows[0]);
  }
  async delete(idComentario) {
    const result = await pool.query(
      `DELETE FROM comentarios WHERE idcomentario = $1 RETURNING *`,
      [idComentario]
    );

    return result.rowCount > 0 ? true : false;
  }

  async findById(idComentario) {
    const result = await pool.query(
      `SELECT * FROM comentarios WHERE idcomentario = $1`,
      [idComentario]
    );
    return result.rows[0] || null;
  }
}

export default new ComentarioRepository();
