import ProyectoService from "../services/ProyectoService.js";

class ProyectoController {
  async crearProyecto(req, res) {
    try {
      const idUsuarioCreador = req.user.idUsuario;
      const { nombreProyecto, descripcion, fechaFin } = req.body;

      const data = await ProyectoService.crearProyecto({
        idUsuarioCreador,
        nombreProyecto,
        descripcion,
        fechaFin,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async asignarPO(req, res) {
    try {
      const { idProyecto } = req.params;
      const { emailOrUsername } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const resultado = await ProyectoService.asignarPO({
        idProyecto,
        emailOrUsername,
        idUsuarioSolicitante,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerProyecto(req, res) {
    try {
      const { idProyecto } = req.params;

      const proyecto = await ProyectoService.obtenerProyecto(idProyecto);

      return res.status(200).json(proyecto);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerProyectosDeUsuario(req, res) {
    try {
      const idUsuario = req.user.idUsuario;

      const proyectos = await ProyectoService.obtenerProyectosDeUsuario(
        idUsuario
      );

      return res.status(200).json(proyectos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async asignarSDM(req, res) {
    try {
      const { idProyecto } = req.params;
      const { emailOrUsername } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const resultado = await ProyectoService.asignarSDM({
        idProyecto,
        emailOrUsername,
        idUsuarioSolicitante,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerRolDelUsuario(req, res) {
    try {
      const { idUsuario, idProyecto } = req.params;

      const rol = await ProyectoService.obtenerRolDelUsuario(
        idUsuario,
        idProyecto
      );

      return res.status(200).json({ rol });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerEquipos(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const equipos = await ProyectoService.obtenerEquipos(
        idProyecto,
        idUsuarioSolicitante
      );

      return res.status(200).json(equipos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async editarProyecto(req, res) {
    try {
      const { idProyecto } = req.params;
      const { nombreProyecto, descripcion, fechaFin } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const response = await ProyectoService.editarProyecto(
        idProyecto,
        { nombreProyecto, descripcion, fechaFin },
        idUsuarioSolicitante
      );

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarProyecto(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const response = await ProyectoService.eliminarProyecto(
        idProyecto,
        idUsuarioSolicitante
      );

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerDashboard(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuario = req.user.idUsuario;

      const dashboard = await ProyectoService.obtenerDashboard(
        idProyecto,
        idUsuario
      );

      return res.status(200).json(dashboard);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new ProyectoController();
