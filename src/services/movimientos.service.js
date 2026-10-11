import { db } from "../config/database.js";
import { movimientosRepo } from "../repositories/movimientos.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

export const movimientosService = {
  listar: (filtros) => movimientosRepo.findAll(filtros),

  crear: (data, usuarioId) => {
    const { producto_id, tipo, cantidad, motivo } = data;

    const producto = db
      .prepare("SELECT * FROM productos WHERE id = ? AND activo = 1")
      .get(producto_id);
    if (!producto) throw new AppError("Producto no encontrado o inactivo", 404);

    let nuevoStock;
    if (tipo === "entrada") {
      nuevoStock = producto.stock_actual + cantidad;
    } else if (tipo === "salida") {
      if (cantidad > producto.stock_actual) {
        throw new AppError(
          `Stock insuficiente. Disponible: ${producto.stock_actual}, solicitado: ${cantidad}`,
          409
        );
      }
      nuevoStock = producto.stock_actual - cantidad;
    } else if (tipo === "ajuste") {
      if (!motivo || motivo.trim() === "") {
        throw new AppError("El ajuste requiere un motivo obligatorio", 400);
      }
      nuevoStock = cantidad;
    } else {
      throw new AppError("Tipo de movimiento inválido", 400);
    }

    // Transacción manual (node:sqlite no tiene db.transaction)
    db.exec("BEGIN");
    try {
      const mov = movimientosRepo.create({
        producto_id,
        usuario_id: usuarioId,
        tipo,
        cantidad,
        motivo,
      });

      db.prepare("UPDATE productos SET stock_actual = ? WHERE id = ?").run(
        nuevoStock,
        producto_id
      );

      db.exec("COMMIT");
      return mov;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  },
};
