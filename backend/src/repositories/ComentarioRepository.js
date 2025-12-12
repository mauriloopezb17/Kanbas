import { pool } from "../config/database.js";
import Comentario from "../models/Comentario.js";

class ComentarioRepository {
  async findByTarea(idTarea) {
    const result = await pool.query(
      `SELECT 
         c.idcomentario, 
         c.contenido, 
         c.fecha, 
         c.idtarea, 
         c.idusuario,
         u.usuario,
         u.nombre,
         u.apellido
       FROM comentarios c
       JOIN usuarios u ON u.idusuario = c.idusuario
       WHERE c.idtarea = $1 
       ORDER BY c.fecha ASC`,
      [idTarea]
    );
    // map to raw objects with extra fields, or update model?
    // Repository returning model instances usually strips extra fields if model is strict.
    // Let's check Comentario.js model?
    // If I cant check model, I'll return result.rows directly as this is a DTO-like usage for frontend.
    // Usually "new Comentario(row)" might only assign known fields.
    return result.rows; 
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
