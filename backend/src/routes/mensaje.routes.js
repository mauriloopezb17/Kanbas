import { Router } from "express";
import MensajeController from "../controllers/MensajeController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";

const router = Router();

router.post(
  "/enviar",
  authMiddleware,
  projectMiddleware,
  MensajeController.enviarMensaje
);

router.get(
  "/recibidos/:idUsuario",
  authMiddleware,
  MensajeController.obtenerMensajesRecibidos
);

router.get(
  "/enviados/:idUsuario",
  authMiddleware,
  MensajeController.obtenerMensajesEnviados
);

export default router;
