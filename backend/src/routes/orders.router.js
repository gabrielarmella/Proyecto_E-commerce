import { Router } from "express";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import orderController from "../controllers/order.controller.js";

const router = Router();

router.post("/checkout", authMiddleware, asyncHandler(orderController.checkout));
router.get("/my", authMiddleware, asyncHandler(orderController.getMyOrders));
router.get("/", authMiddleware, adminOnly, asyncHandler(orderController.getAllOrders));

export default router;