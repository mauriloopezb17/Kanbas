import { Router } from "express";
import ComentarioController from "../controllers/ComentarioController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";

const router = Router();

router.post(
  "/crear",
  authMiddleware,
  projectMiddleware,
  ComentarioController.crearComentario
);

router.post(
  "/listar/:idTarea/:idProyecto",
  authMiddleware,
  projectMiddleware,
  ComentarioController.obtenerComentarios
);

export default router;
