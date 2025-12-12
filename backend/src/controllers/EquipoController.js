import EquipoService from "../services/EquipoService.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";

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
      const { idEquipo } = req.params;

      const eliminado = await EquipoService.eliminarEquipo(idEquipo);

      return res.status(200).json({
        mensaje: "Equipo eliminado correctamente.",
        equipo: eliminado,
      });
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

  async getEquiposByProyecto(req, res) {
    try {
      const { idProyecto } = req.params;

      const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

      return res.status(200).json(equipos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getIntegrantesByEquipo(req, res) {
    try {
      const { idEquipo } = req.params;

      const integrantes = await IntegrantesRepository.getIntegrantes(idEquipo);

      return res.status(200).json(integrantes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarEquipo(req, res) {
    try {
      const { idEquipo } = req.params;

      const resultado = await EquipoService.eliminarEquipo(idEquipo);

      return res.status(200).json({
        mensaje: "Equipo eliminado con todas sus dependencias.",
        detalles: resultado,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarIntegrante(req, res) {
    try {
      const { idIntegrante } = req.params;

      await EquipoService.eliminarIntegrante(idIntegrante);

      return res.status(200).json({
        mensaje: "Integrante eliminado correctamente.",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new EquipoController();
