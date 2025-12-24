const pool = require('../config/database');

/**
 * Obtener todos los productos
 */
exports.getProducts = async (req, res) => {
    try {
        const [products] = await pool.execute('SELECT * FROM productos');
        res.json(products);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener producto por ID
 */
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await pool.execute(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Crear nuevo producto
 */
exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagen } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, categoria, imagen]
        );

        res.status(201).json({
            message: 'Producto creado',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};