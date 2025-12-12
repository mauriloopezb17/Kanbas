import NotificacionRepository from "../repositories/NotificacionRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";

class NotificacionService {
  async crearNotificacion({
    idUsuarioEmisor,
    titulo,
    contenido,
    idProyecto,
    destinatarios,
  }) {
    if (!titulo || !contenido) {
      throw new Error(
        "El título y contenido de la notificación son obligatorios."
      );
    }

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioEmisor,
      idProyecto
    );

    if (!rol) {
      throw new Error(
        "No perteneces al proyecto. No puedes enviar notificaciones."
      );
    }

    const nuevaNotificacion = await NotificacionRepository.createNotificacion({
      titulo,
      contenido,
      idUsuarioEmisor,
    });

    const idNotificacion = nuevaNotificacion.idNotificacion;

    if (!destinatarios || destinatarios.length === 0) {
      if (!["Product Owner", "PO", "SRM", "SDM"].includes(rol)) {
        throw new Error(
          "Solo PO, SDM o SRM pueden notificar a todos los miembros del proyecto."
        );
      }

      const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);
      let usuarios = [];

      for (const eq of equipos) {
        const integrantes = await IntegrantesRepository.getIntegrantes(
          eq.idEquipo
        );
        usuarios.push(...integrantes);
      }

      const map = new Map();
      usuarios.forEach((u) => map.set(u.idusuario, u));

      const listaUsuarios = [...map.values()];

      for (const usuario of listaUsuarios) {
        if (usuario.idusuario === idUsuarioEmisor) continue;

        await NotificacionRepository.addDestinatario(
          idNotificacion,
          usuario.idusuario
        );
      }

      return {
        mensaje: "Notificación enviada a todos los miembros del proyecto.",
        notificacion: nuevaNotificacion,
      };
    }

    for (const idUsuarioDestino of destinatarios) {
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

      await NotificacionRepository.addDestinatario(
        idNotificacion,
        idUsuarioDestino
      );
    }

    return {
      mensaje: "Notificación enviada correctamente.",
      notificacion: nuevaNotificacion,
    };
  }

  async obtenerNotificaciones(idUsuario) {
    const usuario = await UsuarioRepository.findById(idUsuario);
    if (!usuario) throw new Error("El usuario no existe.");

    const notificaciones =
      await NotificacionRepository.getNotificacionesUsuario(idUsuario);

    return notificaciones;
  }
}

export default new NotificacionService();
