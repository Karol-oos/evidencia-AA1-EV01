const authService = require('../services/auth.service');

/**
 * Controlador para registro de usuarios
 */
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        // Llamar al servicio
        const result = await authService.registerUser({
            nombre,
            email,
            password
        });
        
        // Responder al cliente
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result
        });
        
    } catch (error) {
        console.error('Error en controlador de registro:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error interno del servidor'
        });
    }
};

/**
 * Controlador para login de usuarios
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Llamar al servicio
        const result = await authService.loginUser({
            email,
            password
        });
        
        // Responder al cliente
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: result
        });
        
    } catch (error) {
        console.error('Error en controlador de login:', error);
        
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'Error interno del servidor'
        });
    }
};