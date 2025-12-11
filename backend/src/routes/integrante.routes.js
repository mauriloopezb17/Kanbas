import { Router } from "express";
import IntegranteController from "../controllers/IntegranteController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/agregar",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  IntegranteController.agregarIntegrante
);

router.post(
  "/equipo/:idEquipo/:idProyecto",
  authMiddleware,
  projectMiddleware,
  IntegranteController.obtenerIntegrantesPorEquipo
);

router.post(
  "/proyecto/:idProyecto",
  authMiddleware,
  projectMiddleware,
  IntegranteController.obtenerIntegrantesDelProyecto
);

router.get(
  "/equipo-usuario/:idProyecto/:idUsuario",
  authMiddleware,
  projectMiddleware,
  IntegranteController.obtenerEquipoDeUsuario
);

export default router;
