import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import ReporteRendimientoController from "../controllers/ReporteRendimientoController.js";

const router = Router();

router.get(
  "/rendimiento/:idProyecto",
  authMiddleware,
  ReporteRendimientoController.generarReporte
);

export default router;
