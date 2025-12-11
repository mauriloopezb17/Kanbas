import { pool } from "../config/database.js";
import Usuario from "../models/Usuario.js";

class UsuarioRepository {
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE idusuario = $1`,
      [id]
    );

    return result.rows.length ? new Usuario(result.rows[0]) : null;
  }

  async findByIdentifier(identifier) {
    const column = identifier.includes("@") ? "email" : "usuario";

    const result = await pool.query(
      `SELECT * FROM usuarios WHERE ${column} = $1`,
      [identifier]
    );

    return result.rows.length ? new Usuario(result.rows[0]) : null;
  }

  async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [
      email,
    ]);
    return result.rows.length ? new Usuario(result.rows[0]) : null;
  }

  async register(usuario) {
    const result = await pool.query(
      `INSERT INTO usuarios(nombre, apellido, email, usuario, password)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
      [
        usuario.nombre,
        usuario.apellido,
        usuario.email,
        usuario.usuario,
        usuario.password,
      ]
    );

    return new Usuario(result.rows[0]);
  }

  async getProjectsOfUser(idUsuario) {
    const rolesDirectos = await pool.query(
      `SELECT * FROM proyectos 
             WHERE idusuario_po = $1 
                OR idusuario_srm = $1 
                OR idusuario_sdm = $1`,
      [idUsuario]
    );

    const integranteProyectos = await pool.query(
      `SELECT p.* 
             FROM integrantes i
             JOIN equipos e ON e.idequipo = i.idequipo
             JOIN proyectos p ON p.idproyecto = e.idproyecto
             WHERE i.idusuario = $1`,
      [idUsuario]
    );

    // Eliminación de proyectos repetidos
    const mapa = new Map();

    rolesDirectos.rows.forEach((p) => mapa.set(p.idproyecto, p));
    integranteProyectos.rows.forEach((p) => mapa.set(p.idproyecto, p));

    return [...mapa.values()];
  }

  // Obtener el rol del Usuario en el proyecto
  async getUserRoleInProject(idUsuario, idProyecto) {
    const proyecto = await pool.query(
      `SELECT idusuario_po, idusuario_srm, idusuario_sdm 
             FROM proyectos WHERE idproyecto = $1`,
      [idProyecto]
    );

    if (!proyecto.rows.length) return null;

    const row = proyecto.rows[0];

    if (row.idusuario_po === idUsuario) return "Product Owner";
    if (row.idusuario_srm === idUsuario) return "SRM";
    if (row.idusuario_sdm === idUsuario) return "SDM";

    const integrante = await pool.query(
      `SELECT * FROM integrantes i
             JOIN equipos e ON e.idequipo = i.idequipo
             WHERE e.idproyecto = $1 AND i.idusuario = $2`,
      [idProyecto, idUsuario]
    );

    if (integrante.rows.length) return "Integrante";

    return null;
  }
}

export default new UsuarioRepository();
