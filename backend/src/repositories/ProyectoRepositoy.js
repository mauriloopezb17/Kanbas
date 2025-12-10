import pool from "../config/database.js";
import Proyecto from "../structures/Proyecto.js";

class ProyectoRepository {
  async createProyecto({ idUsuario_SRM, nombre, descripcion, fechaFin }) {
    const result = await pool.query(
      `INSERT INTO proyectos(idusuario_srm, nombreproyecto, descripcion, fechacreacion, fechafin)
             VALUES ($1, $2, $3, NOW(), $4)
             RETURNING *`,
      [idUsuario_SRM, nombre, descripcion, fechaFin]
    );

    return new Proyecto(result.rows[0]);
  }

  async assignPO(idProyecto, idUsuarioPO) {
    await pool.query(
      `UPDATE proyectos SET idusuario_po = $1 WHERE idproyecto = $2`,
      [idUsuarioPO, idProyecto]
    );
  }

  async assignSDM(idProyecto, idUsuarioSDM) {
    await pool.query(
      `UPDATE proyectos SET idusuario_sdm = $1 WHERE idproyecto = $2`,
      [idUsuarioSDM, idProyecto]
    );
  }

  async findById(idProyecto) {
    const result = await pool.query(
      `SELECT * FROM proyectos WHERE idproyecto = $1`,
      [idProyecto]
    );

    return result.rows.length ? new Proyecto(result.rows[0]) : null;
  }
}

export default new ProyectoRepository();
