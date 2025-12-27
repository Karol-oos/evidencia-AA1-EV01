// user.js
const { pool } = require('./database');
const bcrypt = require('bcrypt');

class User {
    async createUser(userData) {
        const { username, email, password, full_name, role = 'user' } = userData;
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const query = `
            INSERT INTO users (username, email, password, full_name, role, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id, username, email, full_name, role, created_at;
        `;
        const values = [username, email, hashedPassword, full_name, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async getUserById(id) {
        const query = 'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async updateUser(id, userData) {
        const { username, email, full_name } = userData;
        const query = `
            UPDATE users 
            SET username = $1, email = $2, full_name = $3, updated_at = NOW()
            WHERE id = $4
            RETURNING id, username, email, full_name, role;
        `;
        const values = [username, email, full_name, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    async getAllUsers() {
        const query = 'SELECT id, username, email, full_name, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = new User();