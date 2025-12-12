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
        integrantes,
      } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.crearTarea({
        idProyecto,
        idEquipo,
        titulo,
        descripcion,
        prioridad,
        fechaLimite,
        integrantes,
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

  async eliminarTarea(req, res) {
    try {
      const { idTarea } = req.params;

      const tarea = await TareaService.eliminarTarea(idTarea);

      return res.status(200).json({
        mensaje: "Tarea eliminada correctamente.",
        tarea,
      });
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

  async obtenerTarea(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;

      const data = await TareaService.obtenerTarea(
        parseInt(idTarea),
        parseInt(idProyecto)
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async autoasignarTarea(req, res) {
    try {
      const { idTarea, idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await TareaService.autoasignarTarea(
        parseInt(idTarea),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new TareaController();
