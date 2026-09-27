import { categoriasService } from "../services/categorias.service.js";

export const categoriasController = {
  listar: (req, res) => {
    res.json(categoriasService.listar());
  },
  crear: (req, res, next) => {
    try {
      const nueva = categoriasService.crear(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
  },
};
