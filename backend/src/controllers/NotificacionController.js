import NotificacionService from "../services/NotificacionService.js";

class NotificacionController {
  async crearNotificacion(req, res) {
    try {
      const { idUsuarioEmisor, titulo, contenido, idProyecto, destinatarios } =
        req.body;

      const data = await NotificacionService.crearNotificacion({
        idUsuarioEmisor,
        titulo,
        contenido,
        idProyecto,
        destinatarios,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerNotificacionesRecibidas(req, res) {
    try {
      const { idUsuario } = req.params;

      const notificaciones =
        await NotificacionService.obtenerNotificacionesRecibidas(idUsuario);

      return res.status(200).json(notificaciones);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerNotificacionesEnviadas(req, res) {
    try {
      const { idUsuario } = req.params;

      const notificaciones =
        await NotificacionService.obtenerNotificacionesEnviadas(idUsuario);

      return res.status(200).json(notificaciones);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerNotificaciones(req, res) {
    try {
      const idUsuario = req.user.idUsuario;

      const data = await NotificacionService.obtenerNotificaciones(idUsuario);

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new NotificacionController();
