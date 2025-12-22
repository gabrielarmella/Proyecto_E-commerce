import AppError from "../utils/appError.js";

export const notFoundHandler = ( req, res, next) => {
    next(new AppError(`Ruta ${req.originlUrl} no encontrada`, 404, "NOT_FOUND"));
}

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_ERROR";
    const payload = {
        success: false,
        error: {
            code,
            message: err.message || "Error interno del servidor",
        },
    };
    if (err.details) {
        payload.error.details = err.details;
    }
    res.status(statusCode).json(payload);
};