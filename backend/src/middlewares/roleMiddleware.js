import UsuarioRepository from "../repositories/UsuarioRepository.js";

function roleMiddleware(rolesPermitidos) {
  return async (req, res, next) => {
    try {
      const idUsuario = req.user.idUsuario; // JWT
      const idProyecto = req.params.idProyecto || req.body.idProyecto;

      if (!idProyecto) {
        return res
          .status(400)
          .json({ error: "Falta el idProyecto para validar permisos." });
      }

      const rol = await UsuarioRepository.getUserRoleInProject(
        idUsuario,
        idProyecto
      );

      if (!rol) {
        return res
          .status(403)
          .json({ error: "No perteneces a este proyecto." });
      }

      if (!rolesPermitidos.includes(rol)) {
        return res
          .status(403)
          .json({ error: "No tienes permisos para realizar esta acción." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error en roleMiddleware: " + error.message });
    }
  };
}

export default roleMiddleware;
