import { pool } from "../config/database.js";
import Equipo from "../models/Equipo.js";

class EquipoRepository {
  async createEquipo(idProyecto, nombreEquipo) {
    const result = await pool.query(
      `INSERT INTO equipos(idproyecto, nombreequipo)
             VALUES ($1, $2)
             RETURNING *`,
      [idProyecto, nombreEquipo]
    );

    return new Equipo(result.rows[0]);
  }

  async getEquiposByProyecto(idProyecto) {
    const result = await pool.query(
      `SELECT * FROM equipos WHERE idproyecto = $1`,
      [idProyecto]
    );

    return result.rows.map((row) => new Equipo(row));
  }

  async eliminarIntegrante(idIntegrante) {
    const result = await pool.query(
      `DELETE FROM integrantes WHERE idintegrante = $1 RETURNING *`,
      [idIntegrante]
    );

    return result.rows[0];
  }

  async eliminarEquipoYDependencias(idEquipo) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const tareasResult = await client.query(
        `SELECT idtarea
       FROM tareas
       WHERE idequipo = $1`,
        [idEquipo]
      );

      const tareas = tareasResult.rows;

      await client.query(
        `DELETE FROM asignacion
       WHERE idtarea IN (
         SELECT idtarea FROM tareas WHERE idequipo = $1
       )`,
        [idEquipo]
      );

      await client.query(
        `DELETE FROM comentarios
       WHERE idtarea IN (
         SELECT idtarea FROM tareas WHERE idequipo = $1
       )`,
        [idEquipo]
      );

      await client.query(
        `DELETE FROM tareas
       WHERE idequipo = $1`,
        [idEquipo]
      );

      await client.query(
        `DELETE FROM integrantes
       WHERE idequipo = $1`,
        [idEquipo]
      );
      const result = await client.query(
        `DELETE FROM equipos
       WHERE idequipo = $1
       RETURNING *`,
        [idEquipo]
      );

      await client.query("COMMIT");

      return {
        equipo: result.rows[0],
        tareasEliminadas: tareas.length,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new EquipoRepository();
