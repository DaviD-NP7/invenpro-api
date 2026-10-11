import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware.js";
import { usuariosRepo } from "../repositories/usuarios.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_por_defecto";

export const autenticar = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Token no proporcionado", 401);
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const usuario = usuariosRepo.findById(payload.id);
    if (!usuario) throw new AppError("Usuario no encontrado", 401);

    req.usuario = usuario;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("Token inválido o expirado", 401));
    }
    next(error);
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "admin") {
    return next(new AppError("Acceso denegado: solo administradores", 403));
  }
  next();
};
