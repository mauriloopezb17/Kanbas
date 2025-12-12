import IntegranteService from "../services/IntegranteService.js";

class IntegranteController {
  async agregarIntegrante(req, res) {
    try {
      const { idProyecto, idEquipo, emailOrUsername } = req.body;

      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await IntegranteService.agregarIntegrante({
        idProyecto,
        idEquipo,
        emailOrUsername,
        idUsuarioSolicitante,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerIntegrantesPorEquipo(req, res) {
    try {
      const { idEquipo, idProyecto } = req.params;

      const idUsuarioSolicitante = req.user.idUsuario;

      const integrantes = await IntegranteService.obtenerIntegrantesPorEquipo(
        parseInt(idEquipo),
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(integrantes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerIntegrantesDelProyecto(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const integrantes = await IntegranteService.obtenerIntegrantesDelProyecto(
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(integrantes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerEquipoDeUsuario(req, res) {
    try {
      const { idProyecto, idUsuario } = req.params;

      const equipo = await IntegranteService.obtenerEquipoDeUsuario(
        parseInt(idUsuario),
        parseInt(idProyecto)
      );

      return res.status(200).json(equipo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminarIntegrante(req, res) {
    try {
      const { idIntegrante } = req.params;

      const eliminado = await IntegrantesService.eliminarIntegrante(
        idIntegrante
      );

      return res.status(200).json({
        mensaje: "Integrante eliminado correctamente.",
        eliminado,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new IntegranteController();
