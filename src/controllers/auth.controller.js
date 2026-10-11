import { authService } from "../services/auth.service.js";

export const authController = {
  registrar: async (req, res, next) => {
    try {
      const usuario = await authService.registrar(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const resultado = await authService.login(
        req.body.email,
        req.body.password
      );
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },

  yo: (req, res) => {
    res.json(req.usuario);
  },
};
