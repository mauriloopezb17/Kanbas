import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ProyectoRepository from "../repositories/ProyectoRepository.js";

class UsuarioService {
  async buscarPorIdentificador(identifier) {
    const user = await UsuarioRepository.findByIdentifier(identifier);

    if (!user) {
      throw new Error(
        "No existe un usuario con ese email o nombre de usuario."
      );
    }

    return user;
  }

  async buscarPorEmail(email) {
    const user = await UsuarioRepository.findByEmail(email);

    if (!user) {
      throw new Error("No existe un usuario con ese correo.");
    }

    return user;
  }

  async buscarPorUsuario(username) {
    const user = await UsuarioRepository.findByIdentifier(username);

    if (!user) {
      throw new Error("No existe un usuario con ese nombre de usuario.");
    }

    return user;
  }

  async obtenerProyectos(idUsuario) {
    const proyectos = await UsuarioRepository.getProjectsOfUser(idUsuario);

    return proyectos;
  }

  async asignarPO(idProyecto, idUsuarioPO) {
    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");

    const usuario = await UsuarioRepository.findById(idUsuarioPO);
    if (!usuario) throw new Error("El usuario no existe.");

    await ProyectoRepository.assignPO(idProyecto, idUsuarioPO);

    return {
      mensaje: "Product Owner asignado correctamente.",
      proyecto: { idProyecto, idUsuarioPO },
    };
  }

  async asignarSDM(idProyecto, idUsuarioSDM) {
    const proyecto = await ProyectoRepository.findById(idProyecto);
    if (!proyecto) throw new Error("El proyecto no existe.");

    const usuario = await UsuarioRepository.findById(idUsuarioSDM);
    if (!usuario) throw new Error("El usuario no existe.");

    await ProyectoRepository.assignSDM(idProyecto, idUsuarioSDM);

    return {
      mensaje: "Service Delivery Manager asignado correctamente.",
      proyecto: { idProyecto, idUsuarioSDM },
    };
  }

  async obtenerRol(idUsuario, idProyecto) {
    const rol = await UsuarioRepository.getUserRoleInProject(
      idUsuario,
      idProyecto
    );

    if (!rol) {
      throw new Error("El usuario no pertenece a este proyecto.");
    }

    return rol;
  }

  async obtenerPerfil(idUsuario) {
    const user = await UsuarioRepository.findById(idUsuario);
    if (!user) throw new Error("Usuario no encontrado.");

    const proyectos = await UsuarioRepository.getProjectsOfUser(idUsuario);

    return {
      usuario: user,
      proyectos,
    };
  }
}

export default new UsuarioService();
