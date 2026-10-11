import { Router } from "express";
import { productosController } from "../controllers/productos.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  crearProductoSchema,
  actualizarProductoSchema,
} from "../validators/productos.validator.js";
import { autenticar, soloAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar); // todas requieren token

router.get("/", productosController.listar);
router.get("/:id", productosController.obtener);
router.post(
  "/",
  soloAdmin,
  validate(crearProductoSchema, "body"),
  productosController.crear
);
router.patch(
  "/:id",
  soloAdmin,
  validate(actualizarProductoSchema, "body"),
  productosController.actualizar
);
router.delete("/:id", soloAdmin, productosController.eliminar);

export default router;
