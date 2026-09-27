let categorias = [
  { id: 1, nombre: "Abarrotes", descripcion: "Productos de despensa" },
  { id: 2, nombre: "Bebidas", descripcion: "Gaseosas y jugos" },
  { id: 3, nombre: "Lácteos", descripcion: "Leche, queso, yogur" },
];
let nextId = 4;

export const categoriasRepo = {
  findAll: () => categorias,
  findById: (id) => categorias.find((c) => c.id === Number(id)),
  create: (data) => {
    const nueva = { id: nextId++, ...data };
    categorias.push(nueva);
    return nueva;
  },
  existsNombre: (nombre) => categorias.some((c) => c.nombre === nombre),
};
