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
}

export default new EquipoRepository();
