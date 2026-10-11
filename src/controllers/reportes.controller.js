import { reportesService } from "../services/reportes.service.js";

export const reportesController = {
  stockBajo: (req, res) => {
    res.json(reportesService.stockBajo());
  },

  ventas: (req, res, next) => {
    try {
      const { desde, hasta } = req.query;
      res.json(reportesService.ventas(desde, hasta));
    } catch (error) {
      next(error);
    }
  },
};
