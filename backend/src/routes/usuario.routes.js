import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

router.get("/buscar/:identifier", UsuarioController.buscarPorIdentificador);

router.get("/email/:email", UsuarioController.buscarPorEmail);

router.get("/usuario/:usuario", UsuarioController.buscarPorUsuario);

router.get("/proyectos/:idUsuario", UsuarioController.obtenerProyectos);

router.post("/asignar-po", UsuarioController.asignarPO);

router.post("/asignar-sdm", UsuarioController.asignarSDM);

router.get("/rol/:idUsuario/:idProyecto", UsuarioController.obtenerRol);

router.get("/perfil/:idUsuario", UsuarioController.obtenerPerfil);

export default router;
