import ComentarioService from "../services/ComentarioService.js";

class ComentarioController {
  async crearComentario(req, res) {
    try {
      const idUsuarioAutor = req.user.idUsuario;
      const { idTarea, contenido } = req.body;

      const data = await ComentarioService.crearComentario({
        idUsuarioAutor,
        idTarea,
        contenido,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerComentarios(req, res) {
    try {
      const { idTarea } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const comentarios = await ComentarioService.obtenerComentarios(
        parseInt(idTarea),
        idUsuarioSolicitante
      );

      return res.status(200).json(comentarios);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  async eliminarComentario(req, res) {
    try {
      const { idComentario } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await ComentarioService.eliminarComentario(
        parseInt(idComentario),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new ComentarioController();
