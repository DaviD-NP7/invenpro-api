import { productosRepo } from "../repositories/productos.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

export const productosService = {
  listar: (filtros) => productosRepo.findAll(filtros),

  obtener: (id) => {
    const p = productosRepo.findById(id);
    if (!p) throw new AppError("Producto no encontrado", 404);
    return p;
  },

  crear: (data) => {
    if (productosRepo.existsSku(data.sku)) {
      throw new AppError("El SKU ya existe", 409);
    }
    return productosRepo.create(data);
  },

  actualizar: (id, data) => {
    delete data.stock_actual;
    const p = productosRepo.update(id, data);
    if (!p) throw new AppError("Producto no encontrado", 404);
    return p;
  },

  eliminar: (id) => {
    const ok = productosRepo.remove(id);
    if (!ok) throw new AppError("Producto no encontrado", 404);
    return true;
  },
};
