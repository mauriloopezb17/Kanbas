import MensajeRepository from "../repositories/MensajeRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";

class MensajeService {
  async crearMensaje({
    idUsuarioEmisor,
    idProyecto,
    contenido,
    destinatarios,
  }) {
    if (!contenido || contenido.trim() === "") {
      throw new Error("El mensaje no puede estar vacío.");
    }

    const rolEmisor = await UsuarioRepository.getUserRoleInProject(
      idUsuarioEmisor,
      idProyecto
    );

    if (!rolEmisor) {
      throw new Error("No perteneces al proyecto. No puedes enviar mensajes.");
    }

    const mensajeBase = await MensajeRepository.createMensaje(
      idUsuarioEmisor,
      contenido
    );

    const idMensaje = mensajeBase.idmensaje;

    if (!destinatarios || destinatarios.length === 0) {
      throw new Error("Debes elegir al menos un destinatario.");
    }

    const destinatariosUnicos = [...new Set(destinatarios)];

    for (const idUsuarioDestino of destinatariosUnicos) {
      if (idUsuarioDestino === idUsuarioEmisor) continue;

      const rolDestino = await UsuarioRepository.getUserRoleInProject(
        idUsuarioDestino,
        idProyecto
      );

      if (!rolDestino) {
        throw new Error(
          `El usuario con ID ${idUsuarioDestino} no pertenece al proyecto.`
        );
      }

      await MensajeRepository.addReceptor(idMensaje, idUsuarioDestino);
    }

    return {
      mensaje: "Mensaje enviado correctamente.",
      mensajeData: mensajeBase,
    };
  }

  async obtenerMensajesRecibidos(idUsuario) {
    const user = await UsuarioRepository.findById(idUsuario);
    if (!user) throw new Error("El usuario no existe.");

    return await MensajeRepository.getMensajesParaUsuario(idUsuario);
  }

  async obtenerMensajesEnviados(idUsuario) {
    const user = await UsuarioRepository.findById(idUsuario);
    if (!user) throw new Error("El usuario no existe.");

    return await MensajeRepository.getMensajesEnviados(idUsuario);
  }

  async enviarMensaje(idEmisor, receptores, contenido) {
    if (!contenido?.trim()) {
      throw new Error("El contenido del mensaje no puede estar vacío.");
    }

    if (!Array.isArray(receptores) || receptores.length === 0) {
      throw new Error("Debe seleccionar al menos un receptor.");
    }

    const mensaje = await MensajeRepository.crearMensaje(idEmisor, contenido);

    for (const receptor of receptores) {
      const idUsuario = await UsuarioRepository.resolverUsuario(receptor);

      if (!idUsuario) {
        throw new Error(`El receptor '${receptor}' no existe.`);
      }

      if (idUsuario === idEmisor) continue;

      await MensajeRepository.agregarReceptor(mensaje.idmensaje, idUsuario);
    }

    return mensaje;
  }

  async obtenerInbox(idUsuario) {
    return await MensajeRepository.obtenerInbox(idUsuario);
  }
}

export default new MensajeService();
