import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usuariosRepo } from "../repositories/usuarios.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_por_defecto";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const authService = {
  registrar: async (data) => {
    const existe = usuariosRepo.findByEmail(data.email);
    if (existe) throw new AppError("El email ya está registrado", 409);

    const hash = await bcrypt.hash(data.password, 10);
    const usuario = usuariosRepo.create({
      nombre: data.nombre,
      email: data.email,
      password_hash: hash,
      rol: data.rol || "vendedor",
    });

    return usuario;
  },

  login: async (email, password) => {
    const usuario = usuariosRepo.findByEmail(email);
    if (!usuario) throw new AppError("Credenciales inválidas", 401);

    const valida = await bcrypt.compare(password, usuario.password_hash);
    if (!valida) throw new AppError("Credenciales inválidas", 401);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  },
};
