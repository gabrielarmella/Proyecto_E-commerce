import { Router } from 'express';
import { body } from "express-validator";
import cartController from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateObjectId } from "../middlewares/objectId.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get('/', authMiddleware, asyncHandler(cartController.getCart));

router.post(
    "/items",
    authMiddleware,
    [
        body("productId").notEmpty().withMessage("productId es requerido").isMongoId(),
        body("quantity")
            .optional()
            .isInt({ gt: 0 })
            .withMessage("quantity debe ser mayor a 0"),
    ],
    validateRequest,
    asyncHandler(cartController.addItem)
);

router.put(
    "/items/:productId",
    authMiddleware,
    validateObjectId("productId"),
    [body("quantity").isInt({ gt: 0 }).withMessage("quantity debe ser mayor a 0")],
    validateRequest,
    asyncHandler(cartController.updateItemQuantity)
);

router.delete(
    "/items/:productId",
    authMiddleware,
    validateObjectId("productId"),
    asyncHandler(cartController.removeItem)
);

router.post("/clear", authMiddleware, asyncHandler(cartController.clearCart));

export default router;