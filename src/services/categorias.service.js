import { categoriasRepo } from "../repositories/categorias.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

export const categoriasService = {
  listar: () => categoriasRepo.findAll(),
  crear: (data) => {
    if (categoriasRepo.existsNombre(data.nombre)) {
      throw new AppError("La categoría ya existe", 409);
    }
    return categoriasRepo.create(data);
  },
};
