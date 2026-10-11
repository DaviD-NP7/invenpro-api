import { Router } from "express";
import { categoriasController } from "../controllers/categorias.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { crearCategoriaSchema } from "../validators/categorias.validator.js";
import { autenticar, soloAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar); // todas requieren token

router.get("/", categoriasController.listar);
router.post(
  "/",
  soloAdmin,
  validate(crearCategoriaSchema, "body"),
  categoriasController.crear
);

export default router;
