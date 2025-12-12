import { Router } from "express";
import NotificacionController from "../controllers/NotificacionController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/crear",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  NotificacionController.crearNotificacion
);

router.get(
  "/recibidas/:idUsuario",
  authMiddleware,
  NotificacionController.obtenerNotificacionesRecibidas
);

router.get(
  "/enviadas/:idUsuario",
  authMiddleware,
  NotificacionController.obtenerNotificacionesEnviadas
);

router.get("/", authMiddleware, NotificacionController.obtenerNotificaciones);

export default router;
