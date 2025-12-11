import UsuarioRepository from "../repositories/UsuarioRepository.js";

async function projectMiddleware(req, res, next) {
  try {
    const idUsuario = req.user.idUsuario;
    const idProyecto = req.params.idProyecto || req.body.idProyecto;

    if (!idProyecto) {
      return res.status(400).json({ error: "Debe proporcionar idProyecto." });
    }

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuario,
      idProyecto
    );

    if (!rol) {
      return res.status(403).json({
        error: "No perteneces a este proyecto.",
      });
    }

    req.user.rol = rol;

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default projectMiddleware;
