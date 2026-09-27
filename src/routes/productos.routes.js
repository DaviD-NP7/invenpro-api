import { Router } from "express";
import { productosController } from "../controllers/productos.controller.js";

const router = Router();

router.get("/", productosController.listar);
router.get("/:id", productosController.obtener);
router.post("/", productosController.crear);
router.patch("/:id", productosController.actualizar);
router.delete("/:id", productosController.eliminar);

export default router;
