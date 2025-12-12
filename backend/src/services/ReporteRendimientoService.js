import ProyectoRepository from "../repositories/ProyectoRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";
import TareaRepository from "../repositories/TareaRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";

class ReporteRendimientoService {
  async generarReporte(idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No tienes acceso a este proyecto.");
    }

    if (rol !== "Product Owner" && rol !== "SDM" && rol !== "SRM") {
      throw new Error("No tienes permisos para generar este reporte.");
    }

    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("Proyecto no encontrado.");

    const roles = await ProyectoRepository.obtenerRolesDelProyecto(idProyecto);

    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    const equiposConIntegrantes = [];
    for (const eq of equipos) {
      const integrantes = await IntegrantesRepository.getIntegrantes(
        eq.idEquipo
      );

      equiposConIntegrantes.push({
        idEquipo: eq.idequipo,
        nombreEquipo: eq.nombreEquipo,
        integrantes: integrantes.map((i) => ({
          idUsuario: i.idusuario,
          nombre: `${i.nombre} ${i.apellido}`,
        })),
      });
    }

    const tareas = await TareaRepository.findByProyecto(idProyecto);

    const totalTareas = tareas.length;
    const tareasTodo = tareas.filter((t) => t.estado === "TODO").length;
    const tareasInProgress = tareas.filter(
      (t) => t.estado === "IN_PROGRESS"
    ).length;
    const tareasReview = tareas.filter((t) => t.estado === "REVIEW").length;
    const tareasDone = tareas.filter((t) => t.estado === "DONE").length;

    const tareasPorIntegrante = [];

    for (const equipo of equiposConIntegrantes) {
      for (const integrante of equipo.integrantes) {
        const tareasAsignadas = await TareaRepository.getTareasDeUsuario(
          integrante.idUsuario
        );

        const completadas = tareasAsignadas.filter(
          (t) => t.estado === "DONE"
        ).length;

        tareasPorIntegrante.push({
          nombreIntegrante: integrante.nombre,
          equipo: equipo.nombreEquipo,
          tareasCompletadas: completadas,
        });
      }
    }

    const tareasDoneConFecha = tareas
      .filter((t) => t.estado === "DONE" && t.fechaEntrega)
      .map((t) => ({
        idTarea: t.idTarea,
        titulo: t.titulo,
        fechaEntrega: t.fechaEntrega,
      }));

    return {
      proyecto: {
        nombre: proyecto.nombreProyecto,
        descripcion: proyecto.descripcion,
        fechaCreacion: proyecto.fechaCreacion,
        fechaReporte: new Date(),
        roles: roles.map((r) => ({
          nombre: `${r.nombre} ${r.apellido}`,
          rol: r.rol,
        })),
      },

      equipos: equiposConIntegrantes,

      tareas: {
        total: totalTareas,
        todo: tareasTodo,
        inProgress: tareasInProgress,
        review: tareasReview,
        done: tareasDone,
      },

      grafico1: tareasPorIntegrante,
      grafico2: tareasDoneConFecha,
    };
  }
}

export default new ReporteRendimientoService();
