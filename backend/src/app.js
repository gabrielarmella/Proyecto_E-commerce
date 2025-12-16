import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";

import { fileURLToPath } from "url";
import uploadRouter from "./routes/upload.router.js";
import path from "path";

//Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config.js";

//Routers
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";  
import authRouter from "./routes/auth.router.js";
import ordersRouter from "./routes/orders.router.js";

dotenv.config();

const app = express ();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(cors());
app.use(express.json());

//Conexion a la base de datos
connectDB();

//Ruta base
app.get("/", (req, res) => {
    res.json({ message: "API REST funcionando correctamente 😎" });
});

//Documentacion Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);

//Imagenes
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, ".." + "uploads")));

const PORT = process.env.PORT || 3000;

//Levanta el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado escuchando en ${PORT}`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
    
});

    