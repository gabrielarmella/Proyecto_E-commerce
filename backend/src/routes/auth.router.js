import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validateRequest,
  asyncHandler(authController.register)
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  validateRequest,
  asyncHandler(authController.login)
);

router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authMiddleware, asyncHandler(authController.logout));
router.get("/me", authMiddleware, asyncHandler(authController.me));

export default router;