import ComentarioService from "../services/ComentarioService.js";

class ComentarioController {
  async crearComentario(req, res) {
    try {
      const { idUsuarioAutor, idTarea, contenido } = req.body;

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
      const { idTarea, idProyecto } = req.params;
      const { idUsuarioSolicitante } = req.body;

      const comentarios = await ComentarioService.obtenerComentarios(
        parseInt(idTarea),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(comentarios);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new ComentarioController();
