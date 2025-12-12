import TareaRepository from "../repositories/TareaRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";
import ComentarioRepository from "../repositories/ComentarioRepository.js";
import NotificacionRepository from "../repositories/NotificacionRepository.js";
import NotificacionRepository from "../repositories/NotificacionRepository.js";
import ProyectoRepository from "../repositories/ProyectoRepository.js";

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

    try {
      const proyecto = await ProyectoRepository.findById(idProyecto);

      const integrantesEquipo = await IntegrantesRepository.getIntegrantes(
        idEquipo
      );

      if (integrantesEquipo.length > 0) {
        const notificacion = await NotificacionRepository.crearNotificacion({
          titulo: `Nueva tarea asignada a tu equipo`,
          contenido: `La tarea "${
            tarea.titulo
          }" ha sido creada en el proyecto "${
            proyecto?.nombreProyecto ?? ""
          }" y asignada a tu equipo.`,
          idUsuarioEmisor: idUsuarioSolicitante,
        });

        for (const integrante of integrantesEquipo) {
          await NotificacionRepository.agregarDestinatario(
            notificacion.idNotificacion,
            integrante.idusuario
          );
        }
      }
    } catch (error) {
      console.error("Error al enviar notificación por nueva tarea:", error);
    }

    if (integrantes.length > 0) {
      const lista = await IntegrantesRepository.getIntegrantes(idEquipo);

      for (const idIntegrante of integrantes) {
        const existe = lista.find((i) => i.idintegrante === idIntegrante);

        if (!existe) {
          throw new Error(
            `El integrante ${idIntegrante} no pertenece al equipo seleccionado.`
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

  async obtenerTareasDelProyecto(idProyecto, idUsuarioSolicitante) {
    let tareas = await TareaRepository.findByProyecto(idProyecto);

    if (idUsuarioSolicitante) {
      const rol = await UsuarioRepository.getUserRoleInProject(
        idUsuarioSolicitante,
        idProyecto
      );

      const isPrivileged = ["SRM", "SDM", "Product Owner", "PO"].includes(rol);

      if (!isPrivileged && rol) {
        const equipoUsuario =
          await IntegrantesRepository.findEquipoByUsuarioAndProyecto(
            idUsuarioSolicitante,
            idProyecto
          );

        if (equipoUsuario) {
          tareas = tareas.filter((t) => t.idEquipo === equipoUsuario.idequipo);
        } else {
          tareas = [];
        }
      }
    }

    const result = {
      todo: [],
      inProgress: [],
      review: [],
      done: [],
    };

    for (const tarea of tareas) {
      const asignados = await TareaRepository.getUsuariosAsignados(
        tarea.idTarea
      );

      const tareaConAsignados = {
        ...tarea,
        asignados,
      };

      switch (tarea.estado) {
        case "TODO":
          result.todo.push(tareaConAsignados);
          break;
        case "IN_PROGRESS":
          result.inProgress.push(tareaConAsignados);
          break;
        case "REVIEW":
          result.review.push(tareaConAsignados);
          break;
        case "DONE":
          result.done.push(tareaConAsignados);
          break;
      }
    }

    return result;
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

    let idEquipoFinal = datos.idEquipo ?? tareaActual.idEquipo;

    if (datos.idEquipo) {
      const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);
      const equipo = equipos.find((e) => e.idEquipo === datos.idEquipo);
      if (!equipo) throw new Error("El equipo no pertenece al proyecto.");

      await TareaRepository.updateEquipo(idTarea, datos.idEquipo);
    }

    const nuevaTarea = await TareaRepository.updateTarea({
      idTarea,
      titulo: datos.titulo ?? tareaActual.titulo,
      descripcion: datos.descripcion ?? tareaActual.descripcion,
      prioridad: datos.prioridad ?? tareaActual.prioridad,
      fechaLimite: datos.fechaLimite ?? tareaActual.fechaLimite,
    });

    if (Array.isArray(datos.integrantes)) {
      const integrantesEquipo = await IntegrantesRepository.getIntegrantes(
        idEquipoFinal
      );

      for (const idIntegrante of datos.integrantes) {
        const existe = integrantesEquipo.find(
          (i) => i.idintegrante === idIntegrante
        );
        if (!existe)
          throw new Error(
            `El integrante ${idIntegrante} no pertenece al equipo.`
          );
      }

      const asignadosActuales = await TareaRepository.getUsuariosAsignados(
        idTarea
      );
      const asignadosIdIntegrante = asignadosActuales.map(
        (a) => a.idintegrante
      );

      for (const oldId of asignadosIdIntegrante) {
        if (!datos.integrantes.includes(oldId)) {
          await TareaRepository.removeIntegrante(idTarea, oldId);
        }
      }

      for (const newId of datos.integrantes) {
        if (!asignadosIdIntegrante.includes(newId)) {
          await TareaRepository.assignIntegrante(idTarea, newId);
        }
      }
    }

    const asignadosFinales = await TareaRepository.getUsuariosAsignados(
      idTarea
    );

    return {
      mensaje: "Tarea actualizada correctamente.",
      tarea: nuevaTarea,
      asignados: asignadosFinales,
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
      throw new Error("Estado no válido.");
    }

    const tareaActual = await TareaRepository.findById(idTarea);
    if (!tareaActual) throw new Error("La tarea no existe.");
    if (tareaActual.idProyecto !== idProyecto) {
      throw new Error("La tarea no pertenece a este proyecto.");
    }

    const estadoAnterior = tareaActual.estado;
    if (estadoAnterior === nuevoEstado) {
      return {
        mensaje: "La tarea ya se encuentra en ese estado.",
        tarea: tareaActual,
      };
    }

    const transicion = `${estadoAnterior}->${nuevoEstado}`;

    const esIntegrante = rol === "Integrante";
    const esSRMoPO = ["SRM", "Product Owner", "PO"].includes(rol);

    const usuariosAsignados = await TareaRepository.getUsuariosAsignados(
      idTarea
    );
    const estaAsignado = usuariosAsignados.some(
      (u) => u.idusuario === idUsuarioSolicitante
    );

    switch (transicion) {
      case "TODO->IN_PROGRESS":
      case "IN_PROGRESS->REVIEW":
        if (!esIntegrante) {
          throw new Error("Solo un integrante puede cambiar este estado.");
        }
        if (!estaAsignado) {
          throw new Error(
            "Solo integrantes asignados a la tarea pueden moverla de columna."
          );
        }
        break;

      case "REVIEW->DONE":
      case "REVIEW->IN_PROGRESS":
        if (!esSRMoPO) {
          throw new Error("Solo el SRM o el PO pueden cambiar este estado.");
        }
        break;

      default:
        throw new Error("Transición de estado no permitida.");
    }

    let tareaActualizada = await TareaRepository.updateEstado(
      idTarea,
      nuevoEstado
    );

    if (nuevoEstado === "DONE") {
      tareaActualizada = await TareaRepository.actualizarFechaEntrega(idTarea);
    }

    if (estadoAnterior === "IN_PROGRESS" && nuevoEstado === "REVIEW") {
      try {
        const responsables =
          await NotificacionRepository.getResponsablesProyecto(idProyecto);

        if (responsables) {
          const destinatarios = [];

          if (responsables.idusuario_srm) {
            destinatarios.push(responsables.idusuario_srm);
          }

          if (responsables.idusuario_po) {
            destinatarios.push(responsables.idusuario_po);
          }

          if (destinatarios.length > 0) {
            const notificacion = await NotificacionRepository.crearNotificacion(
              {
                titulo: `Tarea "${tareaActualizada.titulo}" lista para revisión`,
                contenido: `La tarea "${tareaActualizada.titulo}" ha sido movida a REVIEW y está lista para revisión.`,
                idUsuarioEmisor: idUsuarioSolicitante,
              }
            );

            for (const idUsuario of destinatarios) {
              if (idUsuario === idUsuarioSolicitante) continue;

              await NotificacionRepository.agregarDestinatario(
                notificacion.idnotificacion,
                idUsuario
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Error al enviar notificación IN_PROGRESS -> REVIEW:",
          error
        );
      }
    }

    if (estadoAnterior === "REVIEW" && nuevoEstado === "DONE") {
      try {
        const notificacion = await NotificacionRepository.crearNotificacion({
          titulo: `Tarea "${tareaActualizada.titulo}" finalizada`,
          contenido: `La tarea "${tareaActualizada.titulo}" ha sido aprobada en revisión y marcada como DONE.`,
          idUsuarioEmisor: idUsuarioSolicitante,
        });

        for (const usuario of usuariosAsignados) {
          await NotificacionRepository.agregarDestinatario(
            notificacion.idnotificacion,
            usuario.idusuario
          );
        }
      } catch (error) {
        console.error("Error enviando notificación de tarea aprobada:", error);
      }
    }

    if (estadoAnterior === "REVIEW" && nuevoEstado === "IN_PROGRESS") {
      try {
        const notificacion = await NotificacionRepository.crearNotificacion({
          titulo: `Tarea "${tareaActualizada.titulo}" rechazada`,
          contenido: `La tarea "${tareaActualizada.titulo}" fue rechazada en la revisión y ha vuelto a IN_PROGRESS.`,
          idUsuarioEmisor: idUsuarioSolicitante,
        });

        for (const usuario of usuariosAsignados) {
          if (usuario.idusuario === idUsuarioSolicitante) continue;

          await NotificacionRepository.agregarDestinatario(
            notificacion.idnotificacion,
            usuario.idusuario
          );
        }
      } catch (error) {
        console.error("Error enviando notificación de tarea rechazada:", error);
      }
    }

    return {
      mensaje: "Estado actualizado correctamente.",
      tarea: tareaActualizada,
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

  async eliminarTarea(idTarea) {
    const eliminada = await TareaRepository.eliminarTarea(idTarea);

    if (!eliminada) {
      throw new Error("La tarea no existe.");
    }

    return eliminada;
  }

  async obtenerComentarios(idTarea, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) throw new Error("No perteneces al proyecto.");

    return await ComentarioRepository.findByTarea(idTarea);
  }

  async obtenerTarea(idTarea, idProyecto) {
    const tarea = await TareaRepository.findById(idTarea);

    if (!tarea) throw new Error("La tarea no existe.");

    if (tarea.idProyecto !== idProyecto) {
      throw new Error("La tarea no pertenece a este proyecto.");
    }

    const asignados = await TareaRepository.getUsuariosAsignados(idTarea);

    return {
      idTarea: tarea.idTarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      fechaLimite: tarea.fechaLimite,
      estado: tarea.estado,
      idEquipo: tarea.idEquipo,
      asignados,
    };
  }

  async autoasignarTarea(idTarea, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    const tarea = await TareaRepository.findById(idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    if (tarea.idProyecto !== idProyecto) {
      throw new Error("La tarea no pertenece a este proyecto.");
    }

    const idEquipo = tarea.idEquipo;

    const integrantesEquipo = await IntegrantesRepository.getIntegrantes(
      idEquipo
    );

    const integranteEncontrado = integrantesEquipo.find(
      (i) => i.idusuario === idUsuarioSolicitante
    );

    if (!integranteEncontrado) {
      throw new Error("No perteneces al equipo asignado a esta tarea.");
    }

    const asignadosActuales = await TareaRepository.getUsuariosAsignados(
      idTarea
    );

    const yaAsignado = asignadosActuales.find(
      (a) => a.idusuario === idUsuarioSolicitante
    );

    if (yaAsignado) {
      throw new Error("Ya estás asignado a esta tarea.");
    }

    await TareaRepository.assignIntegrante(
      idTarea,
      integranteEncontrado.idintegrante
    );

    return {
      mensaje: "Te has autoasignado correctamente a esta tarea.",
      idTarea,
      idUsuario: idUsuarioSolicitante,
    };
  }
}

export default new TareaService();
