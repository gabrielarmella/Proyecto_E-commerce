import { validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(
            new AppError("Datos invalidos", 400, "VALIDATION_ERROR", errors.array())
        );
    }
    return next();
};