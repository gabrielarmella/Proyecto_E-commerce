import { Router } from "express";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";
import productRepository from "../repositories/product.repository.js";

const router = Router();

//GET /api/products/admin/all - Solo admin - listar todos los productos incluyendo activos e inactivos
router.get(
    "/admin/all",
    authMiddleware,
    adminOnly,
    productController.getAdminProducts
);
// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", productController.getProductById);
//GET sin authentication
router.get("/", productController.getPublicProducts);
// PUT /api/products/:id - Solo admin - crear producto
router.put("/:id", authMiddleware, adminOnly, productController.updateProduct);
//POST /api/products - Solo admin - crear producto
router.post("/", authMiddleware, adminOnly, productController.createProduct);
// DELETE /api/products/:id - Solo admin
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    productController.deleteProduct
);

export default router;