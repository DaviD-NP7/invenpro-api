import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import productosRouter from "./routes/productos.routes.js";
import movimientosRouter from "./routes/movimientos.routes.js";
import reportesRouter from "./routes/reportes.routes.js";

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/movimientos", movimientosRouter);
app.use("/reportes", reportesRouter);

// Rate limit en /auth (evita ataques de fuerza bruta)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use("/auth", authLimiter);

// Middleware de logs
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({ ok: true, mensaje: "InvenPro API funcionando" });
});

// Rutas
app.use("/auth", authRouter);
app.use("/categorias", categoriasRouter);
app.use("/productos", productosRouter);

// Manejo de 404 y errores (SIEMPRE al final)
app.use(notFound);
app.use(errorHandler);

export default app;
