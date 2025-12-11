import MensajeService from "../services/MensajeService.js";

class MensajeController {
  async enviarMensaje(req, res) {
    try {
      const { idUsuarioEmisor, idProyecto, contenido, destinatarios } =
        req.body;

      const data = await MensajeService.crearMensaje({
        idUsuarioEmisor,
        idProyecto,
        contenido,
        destinatarios,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerMensajesRecibidos(req, res) {
    try {
      const { idUsuario } = req.params;

      const mensajes = await MensajeService.obtenerMensajesRecibidos(idUsuario);

      return res.status(200).json(mensajes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerMensajesEnviados(req, res) {
    try {
      const { idUsuario } = req.params;

      const mensajes = await MensajeService.obtenerMensajesEnviados(idUsuario);

      return res.status(200).json(mensajes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new MensajeController();
