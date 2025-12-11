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

router.get("/", authMiddleware, ProyectoController.obtenerProyectosDeUsuario);

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

router.put(
  "/:idProyecto/product-owner",
  authMiddleware,
  roleMiddleware(["SRM"]),
  ProyectoController.asignarPO
);

router.put(
  "/:idProyecto/sdm",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM"]),
  ProyectoController.asignarSDM
);

export default router;
