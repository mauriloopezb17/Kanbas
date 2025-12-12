import ReporteRendimientoService from "../services/ReporteRendimientoService.js";

class ReporteRendimientoController {
  async generarReporte(req, res) {
    try {
      const { idProyecto } = req.params;
      const idUsuarioSolicitante = req.user.idUsuario;

      const data = await ReporteRendimientoService.generarReporte(
        parseInt(idProyecto),
        idUsuarioSolicitante
      );

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new ReporteRendimientoController();
