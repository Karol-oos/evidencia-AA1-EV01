const productsService = require('../services/products.service');

/**
 * Controlador para obtener todos los productos
 */
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
        
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos'
        });
    }
};

/**
 * Controlador para obtener producto por ID
 */
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsService.getProductById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
        
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto'
        });
    }
};