const pool = require('../config/database');

class ProductsService {
    /**
     * Obtener todos los productos
     */
    async getAllProducts() {
        try {
            const [products] = await pool.execute(
                'SELECT * FROM productos ORDER BY created_at DESC'
            );
            return products;
        } catch (error) {
            console.error('Error en servicio obtener productos:', error);
            throw new Error('Error al obtener productos de la base de datos');
        }
    }
    
    /**
     * Obtener producto por ID
     */
    async getProductById(id) {
        try {
            const [products] = await pool.execute(
                'SELECT * FROM productos WHERE id = ?',
                [id]
            );
            return products[0] || null;
        } catch (error) {
            console.error('Error en servicio obtener producto por ID:', error);
            throw new Error('Error al obtener producto');
        }
    }
    
    /**
     * Crear nuevo producto
     */
    async createProduct(productData) {
        const { nombre, descripcion, precio, categoria, imagen } = productData;
        
        try {
            const [result] = await pool.execute(
                `INSERT INTO productos 
                (nombre, descripcion, precio, categoria, imagen) 
                VALUES (?, ?, ?, ?, ?)`,
                [nombre, descripcion, precio, categoria, imagen]
            );
            
            return {
                id: result.insertId,
                ...productData
            };
        } catch (error) {
            console.error('Error en servicio crear producto:', error);
            throw new Error('Error al crear producto');
        }
    }
}

module.exports = new ProductsService();