import TareaService from "../services/TareaService.js";

class TareaController {
  async crearTarea(req, res) {
    try {
      const {
        idProyecto,
        idEquipo,
        titulo,
        descripcion,
        prioridad,
        fechaLimite,
      } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.crearTarea({
        idProyecto,
        idEquipo,
        titulo,
        descripcion,
        prioridad,
        fechaLimite,
        idUsuarioSolicitante,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async asignarIntegrante(req, res) {
    try {
      const { idTarea, idIntegrante, idProyecto } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.asignarIntegrante(
        idTarea,
        idIntegrante,
        idProyecto,
        idUsuarioSolicitante
      );

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerTareasDeUsuario(req, res) {
    try {
      const { idUsuario } = req.params;

      const tareas = await TareaService.obtenerTareasDeUsuario(idUsuario);

      return res.status(200).json(tareas);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerTareasDelProyecto(req, res) {
    try {
      const { idProyecto } = req.params;

      const tareas = await TareaService.obtenerTareasDelProyecto(idProyecto);

      return res.status(200).json(tareas);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async editarTarea(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;
      const datos = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.editarTarea(
        parseInt(idTarea),
        parseInt(idProyecto),
        datos,
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cambiarEstado(req, res) {
    try {
      const { idTarea } = req.params;
      const { nuevoEstado, idProyecto } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.cambiarEstado(
        parseInt(idTarea),
        nuevoEstado,
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerAsignados(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const asignados = await TareaService.obtenerAsignados(
        parseInt(idTarea),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(asignados);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async añadirIntegrante(req, res) {
    try {
      const { idTarea, idIntegrante } = req.body;

      const data = await TareaService.añadirIntegrante(idTarea, idIntegrante);

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarTarea(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.eliminarTarea(
        parseInt(idTarea),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerComentarios(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const comentarios = await TareaService.obtenerComentarios(
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

export default new TareaController();
