import UsuarioService from "../services/UsuarioService.js";

class UsuarioController {
  async buscarPorIdentificador(req, res) {
    try {
      const { identifier } = req.params;
      const usuario = await UsuarioService.buscarPorIdentificador(identifier);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const usuario = await UsuarioService.buscarPorEmail(email);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async buscarPorUsuario(req, res) {
    try {
      const { usuario } = req.params;
      const data = await UsuarioService.buscarPorUsuario(usuario);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerProyectos(req, res) {
    try {
      const { idUsuario } = req.params;

      const proyectos = await UsuarioService.obtenerProyectos(idUsuario);
      return res.status(200).json(proyectos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async asignarPO(req, res) {
    try {
      const { idProyecto, idUsuarioPO } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const response = await UsuarioService.asignarPO(
        idProyecto,
        idUsuarioPO,
        idUsuarioSolicitante
      );

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async asignarSDM(req, res) {
    try {
      const { idProyecto, idUsuarioSDM } = req.body;
      const idUsuarioSolicitante = req.user.idUsuario;

      const response = await UsuarioService.asignarSDM(
        idProyecto,
        idUsuarioSDM,
        idUsuarioSolicitante
      );

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerRol(req, res) {
    try {
      const { idUsuario, idProyecto } = req.params;
      const rol = await UsuarioService.obtenerRol(idUsuario, idProyecto);
      return res.status(200).json({ rol });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerPerfil(req, res) {
    try {
      const idUsuario = req.user.idUsuario;

      const usuario = await UsuarioService.obtenerPerfil(idUsuario);

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAllUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.getAllUsuarios();
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerUsuarioPorId(req, res) {
    try {
      const { idUsuario } = req.params;

      const usuario = await UsuarioService.obtenerUsuarioPorId(idUsuario);

      if (!usuario) {
        return res.status(404).json({ error: "El usuario no existe." });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async buscarPorIdentificador2(req, res) {
    try {
      const { identifier } = req.query;

      if (!identifier) {
        return res
          .status(400)
          .json({ error: "Debe proporcionar un identificador." });
      }

      const usuario = await UsuarioService.buscarPorIdentificador(identifier);

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UsuarioController();
