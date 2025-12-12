import { pool } from "../config/database.js";
import Proyecto from "../models/Proyecto.js";

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

  async obtenerProyectoPorId(idProyecto) {
    const result = await pool.query(
      `SELECT * FROM proyectos WHERE idproyecto = $1`,
      [idProyecto]
    );

    return result.rows.length ? new Proyecto(result.rows[0]) : null;
  }

  async findById(idProyecto) {
    const result = await pool.query(
      `SELECT * FROM proyectos WHERE idproyecto = $1`,
      [idProyecto]
    );

    return result.rows.length ? new Proyecto(result.rows[0]) : null;
  }

  async getProjectsOfUser(idUsuario) {
    const result = await pool.query(
      `
    SELECT DISTINCT p.*
    FROM proyectos p
    LEFT JOIN equipos e ON e.idproyecto = p.idproyecto
    LEFT JOIN integrantes i ON i.idequipo = e.idequipo
    WHERE p.idusuario_srm = $1 OR p.idusuario_po = $1 OR p.idusuario_sdm = $1 OR i.idusuario = $1
    ORDER BY p.idproyecto;
    `,
      [idUsuario]
    );

    return result.rows.map((row) => new Proyecto(row));
  }

  async obtenerRolesDelProyecto(idProyecto) {
    const result = await pool.query(
      `SELECT 
        u.idusuario,
        u.nombre,
        u.apellido,
        'PO' AS rol
      FROM proyectos p
      JOIN usuarios u ON u.idusuario = p.idusuario_po
      WHERE p.idproyecto = $1

      UNION ALL

      SELECT 
        u.idusuario,
        u.nombre,
        u.apellido,
        'SRM' AS rol
      FROM proyectos p
      JOIN usuarios u ON u.idusuario = p.idusuario_srm
      WHERE p.idproyecto = $1

      UNION ALL

      SELECT 
        u.idusuario,
        u.nombre,
        u.apellido,
        'SDM' AS rol
      FROM proyectos p
      JOIN usuarios u ON u.idusuario = p.idusuario_sdm
      WHERE p.idproyecto = $1;`,
      [idProyecto]
    );

    return result.rows;
  }

  async obtenerIntegrantesDelProyecto(idProyecto) {
    const result = await pool.query(
      `SELECT 
        u.idusuario,
        u.nombre,
        u.apellido,
        'Integrante' as rol
     FROM equipos e
     JOIN integrantes i ON i.idequipo = e.idequipo
     JOIN usuarios u ON u.idusuario = i.idusuario
     WHERE e.idproyecto = $1`,
      [idProyecto]
    );

    return result.rows;
  }
}

export default new ProyectoRepository();
