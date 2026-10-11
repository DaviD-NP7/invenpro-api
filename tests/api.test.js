import { test, before, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "../src/app.js";
import { db } from "../src/config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tokenAdmin;
let tokenVendedor;
let categoriaId;
let productoId;

before(async () => {
  // Aplicar migraciones
  const migracion = fs.readFileSync(
    path.join(__dirname, "../migrations/001_crear_tablas.sql"),
    "utf-8"
  );
  db.exec(migracion);

  // Limpiar
  db.exec("DELETE FROM movimientos");
  db.exec("DELETE FROM productos");
  db.exec("DELETE FROM categorias");
  db.exec("DELETE FROM usuarios");

  // Crear usuarios
  const hashA = await bcrypt.hash("admin123", 10);
  const hashV = await bcrypt.hash("vendedor123", 10);

  db.prepare(
    "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)"
  ).run("Admin", "admin@test.com", hashA, "admin");
  db.prepare(
    "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)"
  ).run("Vendedor", "vendedor@test.com", hashV, "vendedor");

  // Crear categoría
  const cat = db
    .prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?,?)")
    .run("Test", "Categoría test");
  categoriaId = cat.lastInsertRowid;

  // Crear producto
  const prod = db
    .prepare(
      `
    INSERT INTO productos (sku, nombre, precio_venta, precio_compra, categoria_id, stock_actual, stock_minimo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run("TEST01", "Producto Test", 10, 5, categoriaId, 20, 5);
  productoId = prod.lastInsertRowid;

  // Logins
  const loginAdmin = await request(app)
    .post("/auth/login")
    .send({ email: "admin@test.com", password: "admin123" });
  tokenAdmin = loginAdmin.body.token;

  const loginVend = await request(app)
    .post("/auth/login")
    .send({ email: "vendedor@test.com", password: "vendedor123" });
  tokenVendedor = loginVend.body.token;
});

after(() => {
  db.exec("DELETE FROM movimientos");
  db.exec("DELETE FROM productos");
  db.exec("DELETE FROM categorias");
  db.exec("DELETE FROM usuarios");
});

// --- PRUEBAS ---

test("GET /health devuelve 200", async () => {
  const res = await request(app).get("/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
});

test("Login con credenciales inválidas devuelve 401", async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "admin@test.com", password: "malo" });
  assert.strictEqual(res.status, 401);
});

test("GET /productos sin token devuelve 401", async () => {
  const res = await request(app).get("/productos");
  assert.strictEqual(res.status, 401);
});

test("Vendedor no puede crear producto (403)", async () => {
  const res = await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${tokenVendedor}`)
    .send({
      sku: "X001",
      nombre: "X",
      precio_venta: 1,
      precio_compra: 1,
      categoria_id: categoriaId,
    });
  assert.strictEqual(res.status, 403);
});

test("GET /productos/:id con id inexistente devuelve 404", async () => {
  const res = await request(app)
    .get("/productos/99999")
    .set("Authorization", `Bearer ${tokenAdmin}`);
  assert.strictEqual(res.status, 404);
});

test("Admin puede crear producto (201)", async () => {
  const res = await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send({
      sku: "NUEVO01",
      nombre: "Nuevo",
      precio_venta: 15,
      precio_compra: 8,
      categoria_id: categoriaId,
      stock_minimo: 2,
    });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.sku, "NUEVO01");
});

test("Registrar movimiento de entrada suma stock", async () => {
  const res = await request(app)
    .post("/movimientos")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send({
      producto_id: productoId,
      tipo: "entrada",
      cantidad: 5,
      motivo: "Test",
    });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.tipo, "entrada");

  const p = db
    .prepare("SELECT stock_actual FROM productos WHERE id = ?")
    .get(productoId);
  assert.strictEqual(p.stock_actual, 25);
});

test("Salida mayor al stock devuelve 409", async () => {
  const res = await request(app)
    .post("/movimientos")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send({ producto_id: productoId, tipo: "salida", cantidad: 9999 });
  assert.strictEqual(res.status, 409);
});

test("Ajuste sin motivo devuelve 400", async () => {
  const res = await request(app)
    .post("/movimientos")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send({ producto_id: productoId, tipo: "ajuste", cantidad: 10 });
  assert.strictEqual(res.status, 400);
});

test("Reporte stock-bajo requiere autenticación", async () => {
  const res = await request(app).get("/reportes/stock-bajo");
  assert.strictEqual(res.status, 401);
});
