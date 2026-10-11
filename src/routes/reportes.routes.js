import { Router } from "express";
import { reportesController } from "../controllers/reportes.controller.js";
import { autenticar, soloAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

router.get("/stock-bajo", reportesController.stockBajo);
router.get("/ventas", soloAdmin, reportesController.ventas);

export default router;
