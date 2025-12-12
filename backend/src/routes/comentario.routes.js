import { Router } from "express";
import ComentarioController from "../controllers/ComentarioController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/crear", authMiddleware, ComentarioController.crearComentario);

router.get(
  "/listar/:idTarea",
  authMiddleware,
  ComentarioController.obtenerComentarios
);

router.delete(
  "/eliminar/:idComentario",
  authMiddleware,
  ComentarioController.eliminarComentario
);

export default router;
