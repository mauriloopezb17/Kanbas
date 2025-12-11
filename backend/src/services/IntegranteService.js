import UsuarioRepository from "../repositories/UsuarioRepository.js";
import EquipoRepository from "../repositories/EquipoRepository.js";
import IntegrantesRepository from "../repositories/IntegrantesRepository.js";
import ProyectoRepository from "../repositories/ProyectoRepository.js";

class IntegranteService {
  async agregarIntegrante({
    idProyecto,
    idEquipo,
    emailOrUsername,
    idUsuarioSolicitante,
  }) {
    const rolSolicitante = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rolSolicitante) {
      throw new Error("No perteneces a este proyecto.");
    }

    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);
    const equipo = equipos.find((e) => e.idEquipo === idEquipo);

    if (!equipo) {
      throw new Error("El equipo no existe dentro del proyecto.");
    }

    const usuarioAgregar = await UsuarioRepository.findByIdentifier(
      emailOrUsername
    );

    if (!usuarioAgregar) {
      throw new Error("El usuario que intentas añadir no existe.");
    }

    const idUsuarioAgregar = usuarioAgregar.idUsuario;

    const integrantes = await IntegrantesRepository.getIntegrantes(idEquipo);
    const yaEsta = integrantes.find((i) => i.idusuario === idUsuarioAgregar);

    if (yaEsta) {
      throw new Error("Este usuario ya es integrante de este equipo.");
    }

    const nuevoIntegrante = await IntegrantesRepository.addIntegrante(
      idEquipo,
      idUsuarioAgregar
    );

    return {
      mensaje: "Integrante añadido correctamente.",
      integrante: nuevoIntegrante,
    };
  }

  async obtenerIntegrantesPorEquipo(
    idEquipo,
    idProyecto,
    idUsuarioSolicitante
  ) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    const integrantes = await IntegrantesRepository.getIntegrantes(idEquipo);

    return integrantes;
  }

  async obtenerIntegrantesDelProyecto(idProyecto, idUsuarioSolicitante) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuarioSolicitante,
      idProyecto
    );

    if (!rol) {
      throw new Error("No perteneces a este proyecto.");
    }

    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    let miembros = [];

    for (const eq of equipos) {
      const integrantes = await IntegrantesRepository.getIntegrantes(
        eq.idEquipo
      );
      miembros.push(...integrantes);
    }

    const mapa = new Map();
    miembros.forEach((m) => mapa.set(m.idusuario, m));

    return [...mapa.values()];
  }

  async obtenerEquipoDeUsuario(idUsuario, idProyecto) {
    const equipos = await EquipoRepository.getEquiposByProyecto(idProyecto);

    for (const eq of equipos) {
      const integrantes = await IntegrantesRepository.getIntegrantes(
        eq.idEquipo
      );
      if (integrantes.some((i) => i.idusuario === idUsuario)) {
        return eq;
      }
    }

    return null;
  }
}

export default new IntegranteService();
