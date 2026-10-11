import { movimientosService } from "../services/movimientos.service.js";

export const movimientosController = {
  listar: (req, res) => {
    const filtros = {
      producto: req.query.producto,
      tipo: req.query.tipo,
      desde: req.query.desde,
      hasta: req.query.hasta,
    };
    res.json(movimientosService.listar(filtros));
  },

  crear: (req, res, next) => {
    try {
      const mov = movimientosService.crear(req.body, req.usuario.id);
      res.status(201).json(mov);
    } catch (error) {
      next(error);
    }
  },
};
