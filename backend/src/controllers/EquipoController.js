import EquipoService from "../services/EquipoService.js";

class EquipoController {
  async crearEquipo(req, res) {
    try {
      const { idProyecto, nombreEquipo } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const equipo = await EquipoService.crearEquipo({
        idProyecto,
        nombreEquipo,
        idUsuarioSolicitante,
      });

      return res.status(201).json(equipo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerEquipos(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const equipos = await EquipoService.obtenerEquipos(
        idProyecto,
        idUsuarioSolicitante
      );

      return res.status(200).json(equipos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async editarEquipo(req, res) {
    try {
      const { idEquipo, idProyecto } = req.params;
      const { nuevoNombre } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await EquipoService.editarEquipo(
        parseInt(idEquipo),
        parseInt(idProyecto),
        nuevoNombre,
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarEquipo(req, res) {
    try {
      const { idEquipo, idProyecto } = req.params;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await EquipoService.eliminarEquipo(
        parseInt(idEquipo),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerIntegrantes(req, res) {
    try {
      const { idEquipo, idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const integrantes = await EquipoService.obtenerIntegrantes(
        parseInt(idEquipo),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(integrantes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new EquipoController();
