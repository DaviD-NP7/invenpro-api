import { AppError } from "./error.middleware.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      // Soporta tanto Zod v3 (errors) como Zod v4 (issues)
      const listaErrores = result.error.issues || result.error.errors || [];
      const detalles = listaErrores.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      }));
      return next(new AppError("Datos inválidos", 400, detalles));
    }
    req[source] = result.data;
    next();
  };
};
