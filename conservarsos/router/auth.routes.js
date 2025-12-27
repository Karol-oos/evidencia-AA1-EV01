const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', 
    validate.validateRegister,  // Middleware de validación
    authController.register     // Controlador
);

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario
 * @access  Public
 */
router.post('/login', 
    validate.validateLogin,     // Middleware de validación
    authController.login        // Controlador
);

module.exports = router;