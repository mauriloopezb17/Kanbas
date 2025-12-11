import { Router } from "express";
import ProyectoController from "../controllers/ProyectoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/crear", authMiddleware, ProyectoController.crearProyecto);

router.get(
  "/:idProyecto",
  authMiddleware,
  projectMiddleware,
  ProyectoController.obtenerProyecto
);

router.get(
  "/usuario/:idUsuario",
  authMiddleware,
  ProyectoController.obtenerProyectosDeUsuario
);

router.post(
  "/asignar-po",
  authMiddleware,
  roleMiddleware(["SRM"]),
  ProyectoController.asignarPO
);

router.post(
  "/asignar-sdm",
  authMiddleware,
  roleMiddleware(["SRM"]),
  ProyectoController.asignarSDM
);

router.get(
  "/rol/:idUsuario/:idProyecto",
  authMiddleware,
  ProyectoController.obtenerRolDelUsuario
);

router.post(
  "/equipos/:idProyecto",
  authMiddleware,
  projectMiddleware,
  ProyectoController.obtenerEquipos
);

router.put(
  "/editar/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  ProyectoController.editarProyecto
);

router.delete(
  "/eliminar/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM"]),
  ProyectoController.eliminarProyecto
);

router.get(
  "/dashboard/:idProyecto/:idUsuario",
  authMiddleware,
  projectMiddleware,
  ProyectoController.obtenerDashboard
);

export default router;
