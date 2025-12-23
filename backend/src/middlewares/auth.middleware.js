import AppError from '../utils/appError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = bearer || req.cookies?.accessToken; // cookie opcional
  if (!token) return next(new AppError("No autorizado", 401, "UNAUTHORIZED"));

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    return next(new AppError("Token inválido o expirado", 401, "UNAUTHORIZED"));
  }
};

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next( new AppError("Acceso denegado. Solo administradores", 403, "FORBIDDEN"));
    }
    return next();
};