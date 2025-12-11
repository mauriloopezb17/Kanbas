import UsuarioRepository from "../repositories/UsuarioRepository.js";

const roleMiddleware = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      const idUsuario = req.user.idUsuario;
      const idProyecto = req.params.idProyecto || req.body.idProyecto;

      if (!idProyecto) {
        return res.status(400).json({
          error: "Debe enviar idProyecto para validar permisos.",
        });
      }

      const rol = await UsuarioRepository.getUserRoleInProject(
        idUsuario,
        idProyecto
      );

      if (!rol || !rolesPermitidos.includes(rol)) {
        return res.status(403).json({
          error: "No tienes permisos para realizar esta acción.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
};

export default roleMiddleware;
