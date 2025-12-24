import { Router } from "express";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";
import { validateObjectId } from "../middlewares/objectId.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import productController from "../controllers/product.controller.js";

const router = Router();

//GET /api/products/admin/all - Solo admin - listar todos los productos incluyendo activos e inactivos
router.get(
    "/admin/all",
    authMiddleware,
    adminOnly,
    asyncHandler(productController.getAdminProducts)
);
// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", validateObjectId("id"), asyncHandler(productController.getProductById));
//GET sin authentication
router.get("/", asyncHandler(productController.getPublicProducts));
// PUT /api/products/:id - Solo admin - crear producto
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    validateObjectId("id"),
    asyncHandler(productController.updateProduct)
);
//POST /api/products - Solo admin - crear producto
router.post("/", authMiddleware, adminOnly, asyncHandler(productController.createProduct));
// DELETE /api/products/:id - Solo admin
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    validateObjectId("id"),
    asyncHandler(productController.deleteProduct)
);

export default router;
