import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ComentarioRepository from "../repositories/ComentarioRepository.js";
import TareaRepository from "../repositories/TareaRepository.js";
import NotificacionRepository from "../repositories/NotificacionRepository.js";

class ComentarioService {
  async crearComentario({ idUsuarioAutor, idTarea, contenido }) {
    if (!contenido.trim()) {
      throw new Error("El contenido del comentario no puede estar vacío.");
    }

    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioAutor,
      tarea.idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    const comentarioNuevo = await ComentarioRepository.create({
      contenido,
      fecha: new Date(),
      idTarea,
      idUsuario: idUsuarioAutor,
    });

    try {
      const usuariosAsignados = await TareaRepository.getUsuariosAsignados(
        idTarea
      );

      if (usuariosAsignados.length > 0) {
        const notificacion = await NotificacionRepository.crearNotificacion({
          titulo: `Nuevo comentario en la tarea "${tarea.titulo}"`,
          contenido: `Un nuevo comentario fue añadido en la tarea "${tarea.titulo}".`,
          idUsuarioEmisor: idUsuarioAutor,
        });

        for (const usuario of usuariosAsignados) {
          if (usuario.idusuario === idUsuarioAutor) continue;

          await NotificacionRepository.agregarDestinatario(
            notificacion.idNotificacion,
            usuario.idusuario
          );
        }
      }
    } catch (error) {
      console.error("Error enviando notificación por nuevo comentario:", error);
    }

    return {
      mensaje: "Comentario creado correctamente.",
      comentario: comentarioNuevo,
    };
  }

  async obtenerComentarios(idTarea, idUsuarioSolicitante) {
    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      tarea.idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    return await ComentarioRepository.findByTarea(idTarea);
  }
  async eliminarComentario(idComentario, idUsuarioSolicitante) {
    const comentario = await ComentarioRepository.findById(idComentario);

    if (!comentario) {
      throw new Error("El comentario no existe.");
    }

    const tarea = await TareaRepository.findById(comentario.idtarea);
    if (!tarea) {
      throw new Error("La tarea del comentario no existe.");
    }

    const idProyecto = tarea.idProyecto;

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    const puedeEliminar =
      comentario.idusuario === idUsuarioSolicitante ||
      ["SRM", "SDM", "Product Owner", "PO"].includes(rol);

    if (!puedeEliminar) {
      throw new Error("No tienes permisos para eliminar este comentario.");
    }

    const eliminado = await ComentarioRepository.delete(idComentario);

    if (!eliminado) {
      throw new Error("No se pudo eliminar el comentario.");
    }

    return {
      mensaje: "Comentario eliminado correctamente.",
      idComentario,
    };
  }
}

export default new ComentarioService();
