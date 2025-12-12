import MensajeService from "../services/MensajeService.js";

class MensajeController {
  async enviarMensaje(req, res) {
    try {
      const idEmisor = req.user.idUsuario;
      const { receptores, contenido } = req.body;

      const mensaje = await MensajeService.enviarMensaje(
        idEmisor,
        receptores,
        contenido
      );

      return res.status(201).json({
        mensaje: "Mensaje enviado correctamente.",
        data: mensaje,
      });
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

  async obtenerInbox(req, res) {
    try {
      const idUsuario = req.user.idUsuario;

      const mensajes = await MensajeService.obtenerInbox(idUsuario);

      return res.status(200).json(mensajes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new MensajeController();
