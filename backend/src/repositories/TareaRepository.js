import { pool } from "../config/database.js";
import Tarea from "../models/Tarea.js";

class TareaRepository {
  async createTarea(tarea) {
    const result = await pool.query(
      `INSERT INTO tareas
        (idproyecto, idequipo, titulo, descripcion, prioridad, fechacreacion, fechalimite, estado)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, 'TODO')
       RETURNING *`,
      [
        tarea.idProyecto,
        tarea.idEquipo,
        tarea.titulo,
        tarea.descripcion,
        tarea.prioridad,
        tarea.fechaLimite,
      ]
    );

    return new Tarea(result.rows[0]);
  }

  async findById(idTarea) {
    const result = await pool.query(`SELECT * FROM tareas WHERE idtarea = $1`, [
      idTarea,
    ]);

    if (result.rowCount === 0) return null;
    return new Tarea(result.rows[0]);
  }

  async findByProyecto(idProyecto) {
    const result = await pool.query(
      `SELECT * FROM tareas WHERE idproyecto = $1`,
      [idProyecto]
    );

    return result.rows.map((row) => new Tarea(row));
  }

  async assignIntegrante(idTarea, idIntegrante) {
    await pool.query(
      `INSERT INTO asignacion(idintegrante, idtarea)
       VALUES ($1, $2)`,
      [idIntegrante, idTarea]
    );
  }

  async updateEstado(idTarea, nuevoEstado) {
    const result = await pool.query(
      `UPDATE tareas SET estado = $1
       WHERE idtarea = $2
       RETURNING *`,
      [nuevoEstado, idTarea]
    );

    return new Tarea(result.rows[0]);
  }

  async updateTarea(idTarea, datos) {
    const { titulo, descripcion, prioridad, fechaLimite, idEquipo } = datos;
    const result = await pool.query(
      `UPDATE tareas 
       SET titulo = $1, descripcion = $2, prioridad = $3, fechalimite = $4, idequipo = $5
       WHERE idtarea = $6
       RETURNING *`,
      [titulo, descripcion, prioridad, fechaLimite, idEquipo, idTarea]
    );

    if (result.rowCount === 0) return null;
    return new Tarea(result.rows[0]);
  }

  async updateEquipo(idTarea, idEquipo) {
    await pool.query(`UPDATE tareas SET idequipo = $1 WHERE idtarea = $2`, [
      idEquipo,
      idTarea,
    ]);
  }

  async removeIntegrante(idTarea, idIntegrante) {
    await pool.query(
      `DELETE FROM asignacion WHERE idtarea = $1 AND idintegrante = $2`,
      [idTarea, idIntegrante]
    );
  }

  async deleteTarea(idTarea) {
    await pool.query(`DELETE FROM tareas WHERE idtarea = $1`, [idTarea]);
  }

  async getTareasDeUsuario(idUsuario) {
    const result = await pool.query(
      `SELECT t.*
       FROM integrantes i
       JOIN asignacion a ON a.idintegrante = i.idintegrante
       JOIN tareas t ON t.idtarea = a.idtarea
       WHERE i.idusuario = $1`,
      [idUsuario]
    );

    return result.rows.map((row) => new Tarea(row));
  }

  async getUsuariosAsignados(idTarea) {
    const result = await pool.query(
      `SELECT u.*
       FROM asignacion a
       JOIN integrantes i ON i.idintegrante = a.idintegrante
       JOIN usuarios u ON u.idusuario = i.idusuario
       WHERE a.idtarea = $1`,
      [idTarea]
    );

    return result.rows;
  }

  async eliminarTarea(idTarea) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `DELETE FROM asignacion
       WHERE idtarea = $1`,
        [idTarea]
      );

      await client.query(
        `DELETE FROM comentarios
       WHERE idtarea = $1`,
        [idTarea]
      );

      const result = await client.query(
        `DELETE FROM tareas
       WHERE idtarea = $1
       RETURNING *`,
        [idTarea]
      );

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new TareaRepository();
