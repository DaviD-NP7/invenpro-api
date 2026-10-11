import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registroSchema, loginSchema } from "../validators/auth.validator.js";
import { autenticar, soloAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/registro",
  autenticar,
  soloAdmin,
  validate(registroSchema, "body"),
  authController.registrar
);
router.post("/login", validate(loginSchema, "body"), authController.login);
router.get("/yo", autenticar, authController.yo);

export default router;
