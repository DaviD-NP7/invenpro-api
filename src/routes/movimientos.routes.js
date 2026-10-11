import { Router } from "express";
import { movimientosController } from "../controllers/movimientos.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearMovimientoSchema } from "../validators/movimientos.validator.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

router.get("/", movimientosController.listar);
router.post(
  "/",
  validate(crearMovimientoSchema, "body"),
  movimientosController.crear
);

export default router;
