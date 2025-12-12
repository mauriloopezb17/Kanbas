import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";

class EquipoService {
  async crearEquipo({ idProyecto, nombreEquipo, idUsuarioSolicitante }) {
    if (!nombreEquipo) {
      throw new Error("El nombre del equipo es obligatorio.");
    }

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para crear equipos.");
    }

    const equipoNuevo = await EquipoRepository.createEquipo(
      idProyecto,
      nombreEquipo
    );

    return {
      mensaje: "Equipo creado exitosamente.",
      equipo: equipoNuevo,
    };
  }

  async obtenerEquipos(idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    return equipos;
  }

  async editarEquipo(idEquipo, idProyecto, nuevoNombre, idUsuarioSolicitante) {
    if (!nuevoNombre) {
      throw new Error("El nombre del equipo no puede estar vacío.");
    }

    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!["SRM", "SDM", "Product Owner", "PO"].includes(rol)) {
      throw new Error("No tienes permisos para editar equipos.");
    }

    const actualizado = await EquipoRepository.updateEquipo(
      idEquipo,
      nuevoNombre
    );

    return {
      mensaje: "Equipo actualizado correctamente.",
      equipo: actualizado,
    };
  }

  async eliminarEquipo(idEquipo, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (rol !== "SRM") {
      throw new Error("Solo el SRM puede eliminar equipos.");
    }

    const integrantes = await IntegrantesRepository.getIntegrantes(idEquipo);
    if (integrantes.length > 0) {
      throw new Error("No se puede eliminar un equipo con integrantes.");
    }

    await EquipoRepository.deleteEquipo(idEquipo);

    return { mensaje: "Equipo eliminado correctamente." };
  }

  async obtenerIntegrantes(idEquipo, idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    return await IntegrantesRepository.getIntegrantes(idEquipo);
  }

  async eliminarIntegrante(idIntegrante) {
    const eliminado = await IntegrantesRepository.eliminarIntegrante(
      idIntegrante
    );

    if (!eliminado) {
      throw new Error("No existe un integrante con ese ID.");
    }

    return eliminado;
  }

  async eliminarEquipo(idEquipo) {
    const resultado = await EquipoRepository.eliminarEquipoYDependencias(
      idEquipo
    );

    if (!resultado.equipo) {
      throw new Error("No existe un equipo con ese ID.");
    }

    return resultado;
  }
}

export default new EquipoService();
