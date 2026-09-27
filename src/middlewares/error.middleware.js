export class AppError extends Error {
  constructor(mensaje, status = 500, detalles = []) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

export function notFound(req, res, next) {
  next(
    new AppError(`Ruta ${req.method} ${req.originalUrl} no encontrada`, 404)
  );
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      mensaje: err.message || "Error interno del servidor",
      detalles: err.detalles || [],
    },
  });
}
