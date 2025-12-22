import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError("No autorizado. Token faltante", 401, "UNAUTHORIZED"));
    }
    const token = authHeader.split("")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError("Token invalido o expirado", 401, "UNATHORIZED"));
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next( new AppError("Acceso denegado. Solo administradores", 403, "FORBIDDEN"));
    }
    return next();
};