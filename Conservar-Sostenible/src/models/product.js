// product.js
const { pool } = require('./database');

class Product {
    async createProduct(productData) {
        const { 
            name, 
            description, 
            price, 
            category, 
            location, 
            image_url, 
            is_featured = false 
        } = productData;
        
        const query = `
            INSERT INTO products (name, description, price, category, location, image_url, is_featured, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *;
        `;
        const values = [name, description, price, category, location, image_url, is_featured];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllProducts() {
        const query = 'SELECT * FROM products ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    async getProductById(id) {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async getFeaturedProducts() {
        const query = 'SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC LIMIT 6';
        const result = await pool.query(query);
        return result.rows;
    }

    async getProductsByCategory(category) {
        const query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [category]);
        return result.rows;
    }

    async updateProduct(id, productData) {
        const { name, description, price, category, location, image_url, is_featured } = productData;
        const query = `
            UPDATE products 
            SET name = $1, description = $2, price = $3, category = $4, 
                location = $5, image_url = $6, is_featured = $7, updated_at = NOW()
            WHERE id = $8
            RETURNING *;
        `;
        const values = [name, description, price, category, location, image_url, is_featured, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteProduct(id) {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async searchProducts(searchTerm) {
        const query = `
            SELECT * FROM products 
            WHERE name ILIKE $1 OR description ILIKE $1 OR location ILIKE $1
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    }
}

module.exports = new Product();