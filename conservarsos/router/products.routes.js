const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos
 * @access  Public
 */
router.get('/', productsController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get('/:id', productsController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Crear nuevo producto
 * @access  Private/Admin
 */
router.post('/', 
    authMiddleware.verifyToken,     // Solo usuarios autenticados
    authMiddleware.isAdmin,         // Solo administradores
    productsController.createProduct
);

module.exports = router;