import bcrypt from "bcrypt";
import { db } from "../src/config/database.js";

console.log("🌱 Iniciando seed...");

// Limpiar datos existentes (en orden inverso por las FK)
db.exec("DELETE FROM movimientos");
db.exec("DELETE FROM productos");
db.exec("DELETE FROM categorias");
db.exec("DELETE FROM usuarios");

// Usuarios
const hashAdmin = await bcrypt.hash("admin123", 10);
const hashVend = await bcrypt.hash("vendedor123", 10);

db.prepare(
  "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)"
).run("Admin Principal", "admin@invenpro.com", hashAdmin, "admin");
db.prepare(
  "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)"
).run("Vendedor Uno", "vendedor@invenpro.com", hashVend, "vendedor");

// Categorías
const categorias = [
  ["Abarrotes", "Productos de despensa"],
  ["Bebidas", "Gaseosas, jugos y agua"],
  ["Lácteos", "Leche, queso, yogur"],
  ["Limpieza", "Detergentes y productos de aseo"],
  ["Snacks", "Galletas, papas y dulces"],
];
const insertCat = db.prepare(
  "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)"
);
categorias.forEach((c) => insertCat.run(c[0], c[1]));

// Productos (mínimo 15)
const productos = [
  ["P001", "Arroz 1kg", 4.5, 3.2, 20, 5, 1],
  ["P002", "Azúcar 1kg", 4.0, 2.8, 15, 5, 1],
  ["P003", "Aceite 1L", 9.0, 7.5, 8, 3, 1],
  ["P004", "Fideos 500g", 3.5, 2.5, 25, 6, 1],
  ["P005", "Atún en lata", 6.5, 5.0, 12, 4, 1],
  ["P006", "Gaseosa 3L", 12.0, 9.0, 15, 5, 2],
  ["P007", "Jugo de naranja 1L", 5.5, 4.0, 10, 4, 2],
  ["P008", "Agua mineral 2.5L", 3.0, 2.0, 30, 8, 2],
  ["P009", "Leche 1L", 5.5, 4.0, 3, 5, 3],
  ["P010", "Queso fresco 500g", 12.5, 10.0, 6, 3, 3],
  ["P011", "Yogur natural 1L", 6.0, 4.5, 10, 4, 3],
  ["P012", "Detergente 1kg", 15.0, 12.0, 7, 4, 4],
  ["P013", "Jabón de tocador", 2.5, 1.5, 40, 10, 4],
  ["P014", "Galletas de chocolate", 3.0, 2.0, 18, 5, 5],
  ["P015", "Papas fritas 200g", 4.5, 3.0, 22, 6, 5],
  ["P016", "Chocolate en barra", 2.8, 1.8, 25, 6, 5],
  ["P017", "Café molido 250g", 14.0, 11.0, 4, 5, 1],
];
const insertProd = db.prepare(`
  INSERT INTO productos (sku, nombre, precio_venta, precio_compra, stock_actual, stock_minimo, categoria_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
productos.forEach((p) => insertProd.run(...p));

// Movimientos de ejemplo
const movimientos = [
  [1, 1, "entrada", 20, "Ingreso inicial"],
  [2, 1, "entrada", 15, "Ingreso inicial"],
  [9, 1, "salida", 2, "Venta mostrador"],
  [3, 1, "salida", 3, "Venta mostrador"],
  [6, 2, "entrada", 15, "Reposición de stock"],
];
const insertMov = db.prepare(`
  INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad, motivo)
  VALUES (?, ?, ?, ?, ?)
`);
movimientos.forEach((m) => insertMov.run(...m));

console.log("✅ Seed completado");
console.log("   - 2 usuarios");
console.log("   - 5 categorías");
console.log("   - 17 productos");
console.log("   - 5 movimientos");
