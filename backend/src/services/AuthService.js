import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ProyectoRepository from "../repositories/ProyectoRepository.js";

class AuthService {
  async login(identifier, password) {
    const user = await UsuarioRepository.findByIdentifier(identifier);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    const proyectos = await UsuarioRepository.getProjectsOfUser(user.idUsuario);

    return {
      usuario: user,
      proyectos: proyectos,
    };
  }

  async register({ nombre, apellido, email, usuario, password }) {
    const existeEmail = await UsuarioRepository.findByEmail(email);
    if (existeEmail) {
      throw new Error("Ya existe un usuario registrado con ese email");
    }

    const existeUsuario = await UsuarioRepository.findByIdentifier(usuario);
    if (existeUsuario) {
      throw new Error("Ya existe un usuario con ese nombre de usuario");
    }

    const nuevo = await UsuarioRepository.register({
      nombre,
      apellido,
      email,
      usuario,
      password,
    });

    return nuevo;
  }

  async obtenerRol(idUsuario, idProyecto) {
    return await UsuarioRepository.getUserRoleInProject(idUsuario, idProyecto);
  }
}

export default new AuthService();
