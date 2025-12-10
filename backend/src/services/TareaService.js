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
    idUsuarioSolicitante,
  }) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces al proyecto.");
    }

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

    return {
      mensaje: "Tarea creada correctamente.",
      tarea,
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

    if (integranteObj.idEquipo !== tarea.idEquipo) {
      throw new Error("Este integrante pertenece a otro equipo.");
    }

    const asignados = await TareaRepository.getUsuariosAsignados(idTarea);
    if (asignados.some((u) => u.idusuario === integranteObj.idUsuario)) {
      throw new Error("Este integrante ya está asignado.");
    }

    await TareaRepository.assignIntegrante(idTarea, idIntegrante);

    return { mensaje: "Integrante asignado correctamente." };
  }

  async obtenerTareasDeUsuario(idUsuario) {
    return await TareaRepository.getTareasDeUsuario(idUsuario);
  }

  async obtenerTareasDelProyecto(idProyecto) {
    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    let tareas = [];

    for (const eq of equipos) {
      const tareasEquipo = await TareaRepository.findByProyecto(idProyecto);
      tareas.push(...tareasEquipo);
    }

    return tareas;
  }

  async editarTarea(idTarea, idProyecto, datos, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para editar tareas.");
    }

    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    const tareaEditada = await TareaRepository.updateTarea({
      idTarea,
      ...datos,
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

  async añadirIntegrante(idTarea, idIntegrante) {
    return await TareaRepository.assignIntegrante(idTarea, idIntegrante);
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
