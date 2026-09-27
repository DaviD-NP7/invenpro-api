import { Router } from "express";
import { categoriasController } from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", categoriasController.listar);
router.post("/", categoriasController.crear);

export default router;
