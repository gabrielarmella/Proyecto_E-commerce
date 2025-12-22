import mongoose from "mongoose";
import AppError from "../utils/appError.js";

export const validateObjectId = (paramName = "id") => (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)){
        return next(
            new AppError(`Parametro ${paramName} invalido`, 400, "INVALID_ID")
        );
    }
    return next();
};