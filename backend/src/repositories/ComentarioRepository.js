import pool from "../config/database.js";
import Comentario from "../models/Comentario.js";

class ComentarioRepository {
  async findByTarea(idTarea) {
    const result = await pool.query(
      `SELECT * FROM comentarios WHERE idtarea = '${idTarea}'`,
      [idTarea]
    );

    return result.rows.map((row) => new Comentario(row));
  }

  async create(comentario) {
    const result = await pool.query(
      `INSERT INTO comentarios(contenido, fecha, idtarea, idusuario)
       VALUES ('${comentario.contenido}', '${comentario.fecha}', '${comentario.idTarea}', '${comentario.idUsuario}')
       RETURNING *`,
      [
        comentario.contenido,
        comentario.fecha,
        comentario.idTarea,
        comentario.idUsuario,
      ]
    );

    return new Comentario(result.rows[0]);
  }
}

export default new ComentarioRepository();
