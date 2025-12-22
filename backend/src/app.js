import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import passport from "passport";

await import("./config/passport.js");

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config.js";

import uploadRouter from "./routes/upload.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import authRouter from "./routes/auth.router.js";
import ordersRouter from "./routes/orders.router.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.get("/", (req, res) => {
    res.json({ success: true, message: "API REST funcionando" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);

app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado escuchando en ${PORT}`);
    console.log(`Documentacion: http://localhost:${PORT}/api-docs`);
});