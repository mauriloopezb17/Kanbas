import { Router } from "express";

import authRoutes from "./auth.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import proyectoRoutes from "./proyecto.routes.js";
import equipoRoutes from "./equipo.routes.js";
import integranteRoutes from "./integrante.routes.js";
import tareaRoutes from "./tarea.routes.js";
import comentarioRoutes from "./comentario.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import mensajeRoutes from "./mensaje.routes.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use("/auth", authRoutes); // sin token

router.use("/usuarios", authMiddleware, usuarioRoutes);
router.use("/proyectos", authMiddleware, proyectoRoutes);
router.use("/equipos", authMiddleware, equipoRoutes);
router.use("/integrantes", authMiddleware, integranteRoutes);
router.use("/tareas", authMiddleware, tareaRoutes);
router.use("/comentarios", authMiddleware, comentarioRoutes);
router.use("/notificaciones", authMiddleware, notificacionRoutes);
router.use("/mensajes", authMiddleware, mensajeRoutes);

export default router;
