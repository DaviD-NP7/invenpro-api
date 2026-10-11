import { reportesRepo } from "../repositories/reportes.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

export const reportesService = {
  stockBajo: () => reportesRepo.stockBajo(),

  ventas: (desde, hasta) => {
    if (!desde || !hasta) {
      throw new AppError('Se requieren los parámetros "desde" y "hasta"', 400);
    }
    return reportesRepo.ventas(desde, hasta);
  },
};
