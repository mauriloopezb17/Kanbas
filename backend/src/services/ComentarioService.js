import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ComentarioRepository from "../repositories/ComentarioRepository.js";
import TareaRepository from "../repositories/TareaRepository.js";

class ComentarioService {
  async crearComentario({ idUsuarioAutor, idTarea, contenido }) {
    if (!contenido || contenido.trim() === "") {
      throw new Error("El contenido del comentario no puede estar vacío.");
    }
    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) {
      throw new Error("La tarea no existe.");
    }

    const idProyecto = tarea.idProyecto;

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioAutor,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces al proyecto, no puedes comentar.");
    }

    const comentarioNuevo = await ComentarioRepository.create({
      contenido,
      fecha: new Date(),
      idTarea,
      idUsuario: idUsuarioAutor,
    });

    return {
      mensaje: "Comentario creado correctamente.",
      comentario: comentarioNuevo,
    };
  }
  async obtenerComentarios(idTarea, idUsuarioSolicitante) {
    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    const idProyecto = tarea.idProyecto;

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces al proyecto.");
    }

    const comentarios = await ComentarioRepository.findByTarea(idTarea);

    return comentarios;
  }
}

export default new ComentarioService();
