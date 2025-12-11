import TareaRepository from "../repositories/TareaRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";
import ComentarioRepository from "../repositories/ComentarioRepository.js";

class TareaService {
  async crearTarea({
    idProyecto,
    idEquipo,
    titulo,
    descripcion,
    prioridad,
    fechaLimite,
    integrantes = [],
    idUsuarioSolicitante,
  }) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para crear tareas.");
    }

    if (!titulo) throw new Error("El título es obligatorio.");
    if (!descripcion) throw new Error("La descripción es obligatoria.");
    if (!prioridad) prioridad = 1;

    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);
    const equipo = equipos.find((e) => e.idEquipo === idEquipo);

    if (!equipo) {
      throw new Error("El equipo no pertenece al proyecto.");
    }

    const tarea = await TareaRepository.createTarea({
      idProyecto,
      idEquipo,
      titulo,
      descripcion,
      prioridad,
      fechaLimite,
    });

    if (integrantes.length > 0) {
      const integrantesEquipo = await IntegrantesRepository.getIntegrantes(
        idEquipo
      );

      for (const idIntegrante of integrantes) {
        const existe = integrantesEquipo.find(
          (i) => i.idintegrante === idIntegrante
        );

        if (!existe) {
          throw new Error(
            `El integrante ${idIntegrante} no pertenece a este equipo.`
          );
        }

        await TareaRepository.assignIntegrante(tarea.idTarea, idIntegrante);
      }
    }

    const asignados = await TareaRepository.getUsuariosAsignados(tarea.idTarea);

    return {
      mensaje: "Tarea creada correctamente.",
      tarea,
      asignados,
    };
  }

  async asignarIntegrante(
    idTarea,
    idIntegrante,
    idProyecto,
    idUsuarioSolicitante
  ) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para asignar integrantes.");
    }

    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    const integranteObj = await IntegrantesRepository.findIntegranteById(
      idIntegrante
    );
    if (!integranteObj) throw new Error("El integrante no existe.");

    if (integranteObj.idequipo !== tarea.idEquipo) {
      throw new Error("Este integrante pertenece a otro equipo.");
    }

    const asignados = await TareaRepository.getUsuariosAsignados(idTarea);
    if (asignados.some((u) => u.idusuario === integranteObj.idusuario)) {
      throw new Error("Este integrante ya está asignado.");
    }

    await TareaRepository.assignIntegrante(idTarea, idIntegrante);

    return { mensaje: "Integrante asignado correctamente." };
  }

  async obtenerTareasDeUsuario(idUsuario) {
    return await TareaRepository.getTareasDeUsuario(idUsuario);
  }

  async obtenerTareasDelProyecto(idProyecto) {
    const tareas = await TareaRepository.findByProyecto(idProyecto);

    return {
      todo: tareas.filter((t) => t.estado === "TODO"),
      inProgress: tareas.filter((t) => t.estado === "IN_PROGRESS"),
      review: tareas.filter((t) => t.estado === "REVIEW"),
      done: tareas.filter((t) => t.estado === "DONE"),
    };
  }

  async editarTarea(idTarea, idProyecto, datos, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para editar tareas.");
    }

    const tareaActual = await TareaRepository.findById(idTarea);
    if (!tareaActual) throw new Error("La tarea no existe.");

    const tareaEditada = await TareaRepository.updateTarea({
      idTarea,
      titulo: datos.titulo ?? tareaActual.titulo,
      descripcion: datos.descripcion ?? tareaActual.descripcion,
      prioridad: datos.prioridad ?? tareaActual.prioridad,
      fechaLimite: datos.fechaLimite ?? tareaActual.fechaLimite,
    });

    return {
      mensaje: "Tarea actualizada correctamente.",
      tarea: tareaEditada,
    };
  }

  async cambiarEstado(idTarea, nuevoEstado, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    const estadosPermitidos = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error("Estado inválido.");
    }

    const tarea = await TareaRepository.updateEstado(idTarea, nuevoEstado);

    return {
      mensaje: "Estado actualizado correctamente.",
      tarea,
    };
  }

  async obtenerAsignados(idTarea, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    return await TareaRepository.getUsuariosAsignados(idTarea);
  }

  async eliminarTarea(idTarea, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (rol !== "SRM") {
      throw new Error("Solo el SRM puede eliminar tareas.");
    }

    await TareaRepository.deleteTarea(idTarea);

    return { mensaje: "Tarea eliminada correctamente." };
  }

  async obtenerComentarios(idTarea, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    return await ComentarioRepository.findByTarea(idTarea);
  }
}

export default new TareaService();
