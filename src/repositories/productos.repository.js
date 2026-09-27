let productos = [
  {
    id: 1,
    sku: "P001",
    nombre: "Arroz 1kg",
    precio_venta: 4.5,
    precio_compra: 3.2,
    stock_actual: 20,
    stock_minimo: 5,
    categoria_id: 1,
    activo: 1,
  },
  {
    id: 2,
    sku: "P002",
    nombre: "Aceite 1L",
    precio_venta: 9.0,
    precio_compra: 7.5,
    stock_actual: 8,
    stock_minimo: 3,
    categoria_id: 1,
    activo: 1,
  },
  {
    id: 3,
    sku: "P003",
    nombre: "Leche 1L",
    precio_venta: 5.5,
    precio_compra: 4.0,
    stock_actual: 3,
    stock_minimo: 5,
    categoria_id: 3,
    activo: 1,
  },
  {
    id: 4,
    sku: "P004",
    nombre: "Gaseosa 3L",
    precio_venta: 12.0,
    precio_compra: 9.0,
    stock_actual: 15,
    stock_minimo: 5,
    categoria_id: 2,
    activo: 1,
  },
];
let nextId = 5;

export const productosRepo = {
  findAll: (filtros = {}) => {
    let resultado = productos.filter((p) => p.activo === 1);

    if (filtros.buscar) {
      const texto = filtros.buscar.toLowerCase();
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(texto)
      );
    }
    if (filtros.categoria) {
      resultado = resultado.filter(
        (p) => p.categoria_id === Number(filtros.categoria)
      );
    }
    if (filtros.bajo_stock === "true") {
      resultado = resultado.filter((p) => p.stock_actual <= p.stock_minimo);
    }

    // Ordenamiento
    if (filtros.orden === "precio") {
      resultado.sort((a, b) => a.precio_venta - b.precio_venta);
    } else if (filtros.orden === "nombre") {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return resultado;
  },
  findById: (id) =>
    productos.find((p) => p.id === Number(id) && p.activo === 1),
  create: (data) => {
    const nuevo = { id: nextId++, ...data, stock_actual: 0, activo: 1 };
    productos.push(nuevo);
    return nuevo;
  },
  update: (id, data) => {
    const p = productos.find((x) => x.id === Number(id) && x.activo === 1);
    if (!p) return null;
    Object.assign(p, data);
    return p;
  },
  remove: (id) => {
    const p = productos.find((x) => x.id === Number(id) && x.activo === 1);
    if (!p) return null;
    p.activo = 0;
    return p;
  },
  existsSku: (sku) => productos.some((p) => p.sku === sku && p.activo === 1),
};
