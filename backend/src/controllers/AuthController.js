import AuthService from "../services/AuthService.js";

class AuthController {
  async login(req, res) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res
          .status(400)
          .json({ error: "Debe ingresar usuario/email y contraseña." });
      }

      const data = await AuthService.login(identifier, password);

      return res.status(200).json({
        mensaje: "Inicio de sesión exitoso.",
        usuario: data.usuario,
        proyectos: data.proyectos,
        token: data.token,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { nombre, apellido, email, usuario, password } = req.body;

      if (!nombre || !apellido || !email || !usuario || !password) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios." });
      }

      const nuevoUsuario = await AuthService.register({
        nombre,
        apellido,
        email,
        usuario,
        password,
      });

      return res.status(201).json({
        mensaje: "Usuario registrado exitosamente.",
        usuario: nuevoUsuario,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerRol(req, res) {
    try {
      const { idUsuario, idProyecto } = req.params;

      const rol = await AuthService.obtenerRol(idUsuario, idProyecto);

      return res.status(200).json({ rol });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
