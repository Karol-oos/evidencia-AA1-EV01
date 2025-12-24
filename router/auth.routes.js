const express = require('express');
const { registerUser } = require('../controllers/auth.controller');
const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login (NUEVA RUTA)
router.post('/login', loginUser);
module.exports = router;

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Registra un nuevo usuario
 * responses:
 * 201:
 * description: Usuario creado exitosamente
 */
router.post('/register', registerUser); //