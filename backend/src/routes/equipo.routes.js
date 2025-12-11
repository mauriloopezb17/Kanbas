import { Router } from "express";
import EquipoController from "../controllers/EquipoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/crear",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  EquipoController.crearEquipo
);

router.post(
  "/listar/:idProyecto",
  authMiddleware,
  projectMiddleware,
  EquipoController.obtenerEquipos
);

router.put(
  "/editar/:idEquipo/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  EquipoController.editarEquipo
);

router.delete(
  "/eliminar/:idEquipo/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  EquipoController.eliminarEquipo
);

router.post(
  "/integrantes/:idEquipo/:idProyecto",
  authMiddleware,
  projectMiddleware,
  EquipoController.obtenerIntegrantes
);

router.get(
  "/proyecto/:idProyecto",
  authMiddleware,
  projectMiddleware,
  EquipoController.getEquiposByProyecto
);

export default router;
