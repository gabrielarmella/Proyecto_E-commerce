import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Esperamos: Authorization: Bearer TOKEN
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res 
        .status(401)
        .json({success: false, message: "No autorizado. Token faltante"});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //guardamos info del usuario en req.user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Token inválido o expirado"});
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res 
        .status(403)
        .json({success: false, message: "Acceso denegado. Solo administradores"});
    }
    next();
};