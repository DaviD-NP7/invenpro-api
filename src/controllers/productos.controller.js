import { productosService } from "../services/productos.service.js";

export const productosController = {
  listar: (req, res) => {
    const filtros = {
      buscar: req.query.buscar,
      categoria: req.query.categoria,
      bajo_stock: req.query.bajo_stock,
      orden: req.query.orden,
    };
    res.json(productosService.listar(filtros));
  },

  obtener: (req, res, next) => {
    try {
      res.json(productosService.obtener(req.params.id));
    } catch (error) {
      next(error);
    }
  },

  crear: (req, res, next) => {
    try {
      res.status(201).json(productosService.crear(req.body));
    } catch (error) {
      next(error);
    }
  },

  actualizar: (req, res, next) => {
    try {
      res.json(productosService.actualizar(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  },

  eliminar: (req, res, next) => {
    try {
      productosService.eliminar(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
