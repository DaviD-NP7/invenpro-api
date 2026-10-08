import { Router } from "express";
import { productosController } from "../controllers/productos.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  crearProductoSchema,
  actualizarProductoSchema,
} from "../validators/productos.validator.js";

const router = Router();

router.get("/", productosController.listar);
router.get("/:id", productosController.obtener);
router.post(
  "/",
  validate(crearProductoSchema, "body"),
  productosController.crear
);
router.patch(
  "/:id",
  validate(actualizarProductoSchema, "body"),
  productosController.actualizar
);
router.delete("/:id", productosController.eliminar);

export default router;
