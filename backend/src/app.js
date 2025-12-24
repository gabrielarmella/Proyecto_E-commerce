import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import passport from "passport";
import { connectDB } from "./config/db.js";
import uploadRouter from "./routes/upload.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import authRouter from "./routes/auth.router.js";
import ordersRouter from "./routes/orders.router.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

await import("./config/passport.js");

const app = express();

// Seguridad y parseo
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: false, 
  })
);
app.use(express.json());
// DB y passport
connectDB();
app.use(passport.initialize());
// Rutas
app.get("/", (req, res) => res.json({ success: true, message: "API REST funcionando" }));
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Errores
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en ${PORT}`);
  console.log(`Doc: http://localhost:${PORT}/api-docs`);
});