import ProyectoRepository from "../repositories/ProyectoRepository.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";

class ProyectoService {
  async crearProyecto({
    idUsuarioCreador,
    nombreProyecto,
    descripcion,
    fechaFin,
  }) {
    if (!nombreProyecto)
      throw new Error("El nombre del proyecto es obligatorio.");
    if (!descripcion) throw new Error("La descripción es obligatoria.");

    const nuevoProyecto = await ProyectoRepository.createProyecto({
      idUsuario_SRM: idUsuarioCreador,
      nombre: nombreProyecto,
      descripcion: descripcion,
      fechaFin: fechaFin || null,
    });

    return {
      mensaje: "Proyecto creado exitosamente.",
      proyecto: nuevoProyecto,
    };
  }

  async obtenerProyecto(idProyecto) {
    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");
    return proyecto;
  }

  async obtenerProyectosDeUsuario(idUsuario) {
    return await UsuarioRepository.getProjectsOfUser(idUsuario);
  }

  async asignarPO(idProyecto, idUsuarioPO, idUsuarioSolicitante) {
    const rolSolicitante = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (rolSolicitante !== "SRM") {
      throw new Error("Solo el SRM puede asignar Product Owner.");
    }

    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");

    const usuario = await UsuarioRepository.findById(idUsuarioPO);
    if (!usuario) throw new Error("El usuario no existe.");

    await ProyectoRepository.assignPO(idProyecto, idUsuarioPO);

    return {
      mensaje: "Product Owner asignado correctamente.",
      idProyecto,
      idUsuarioPO,
    };
  }

  async asignarSDM(idProyecto, idUsuarioSDM, idUsuarioSolicitante) {
    const rolSolicitante = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (rolSolicitante !== "SRM") {
      throw new Error("Solo el SRM puede asignar Service Delivery Manager.");
    }

    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");

    const usuario = await UsuarioRepository.findById(idUsuarioSDM);
    if (!usuario) throw new Error("El usuario no existe.");

    await ProyectoRepository.assignSDM(idProyecto, idUsuarioSDM);

    return {
      mensaje: "Service Delivery Manager asignado correctamente.",
      idProyecto,
      idUsuarioSDM,
    };
  }

  async obtenerRolDelUsuario(idUsuario, idProyecto) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuario,
      idProyecto
    );

    if (!rol) {
      throw new Error("El usuario no pertenece a este proyecto.");
    }

    return rol;
  }

  async obtenerEquipos(idProyecto) {
    return await EquipoRepository.getEquiposByProyecto(idProyecto);
  }

  async editarProyecto(
    idProyecto,
    { nombreProyecto, descripcion, fechaFin },
    idUsuarioSolicitante
  ) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["PO", "SRM", "SDM", "Product Owner"].includes(rol)) {
      throw new Error("No tienes permisos para editar este proyecto.");
    }

    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");

    proyecto.nombre = nombreProyecto || proyecto.nombre;
    proyecto.descripcion = descripcion || proyecto.descripcion;
    proyecto.fechaFinEstimada = fechaFin || proyecto.fechaFinEstimada;

    const actualizado = await ProyectoRepository.actualizarProyecto(proyecto);

    return {
      mensaje: "Proyecto actualizado correctamente.",
      proyecto: actualizado,
    };
  }

  async eliminarProyecto(idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (rol !== "SRM") {
      throw new Error("Solo el SRM puede eliminar el proyecto.");
    }

    await ProyectoRepository.deleteProyecto(idProyecto);

    return { mensaje: "Proyecto eliminado correctamente." };
  }

  async obtenerDashboard(idProyecto, idUsuario) {
    await this.obtenerRolDelUsuario(idUsuario, idProyecto);

    const proyecto = await ProyectoRepository.findById(idProyecto);
    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    return {
      proyecto,
      equipos,
    };
  }
}

export default new ProyectoService();
