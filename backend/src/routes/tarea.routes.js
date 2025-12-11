import { Router } from "express";
import TareaController from "../controllers/TareaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import projectMiddleware from "../middlewares/projectMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/crear",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  TareaController.crearTarea
);

router.post(
  "/asignar",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  TareaController.asignarIntegrante
);

router.get(
  "/usuario/:idUsuario",
  authMiddleware,
  TareaController.obtenerTareasDeUsuario
);

router.get(
  "/proyecto/:idProyecto",
  authMiddleware,
  projectMiddleware,
  TareaController.obtenerTareasDelProyecto
);

router.put(
  "/editar/:idTarea/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM", "PO", "SDM"]),
  TareaController.editarTarea
);

router.put(
  "/estado/:idTarea",
  authMiddleware,
  projectMiddleware,
  TareaController.cambiarEstado
);

router.get(
  "/asignados/:idTarea/:idProyecto",
  authMiddleware,
  projectMiddleware,
  TareaController.obtenerAsignados
);

router.delete(
  "/eliminar/:idTarea/:idProyecto",
  authMiddleware,
  projectMiddleware,
  roleMiddleware(["SRM"]),
  TareaController.eliminarTarea
);

router.get(
  "/comentarios/:idTarea/:idProyecto",
  authMiddleware,
  projectMiddleware,
  TareaController.obtenerComentarios
);

export default router;
