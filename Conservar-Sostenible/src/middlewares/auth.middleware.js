const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

/**
 * Middleware para verificar token JWT
 */
exports.verifyToken = (req, res, next) => {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Agregar datos del usuario al request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado.'
        });
    }
};

/**
 * Middleware para verificar si es administrador
 */
exports.isAdmin = (req, res, next) => {
    // En una implementación real, verificaríamos el rol en la base de datos
    // Por ahora, asumimos que si tiene token es admin
    next();
};