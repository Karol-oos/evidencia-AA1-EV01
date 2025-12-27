const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { JWT_SECRET } = process.env;

class AuthService {
    /**
     * Registrar un nuevo usuario
     */
    async registerUser(userData) {
        const { nombre, email, password } = userData;
        
        try {
            // 1. Verificar si el usuario ya existe
            const [existingUsers] = await pool.execute(
                'SELECT id FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (existingUsers.length > 0) {
                throw new Error('El email ya está registrado');
            }
            
            // 2. Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // 3. Insertar usuario en la base de datos
            const [result] = await pool.execute(
                'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
                [nombre, email, hashedPassword]
            );
            
            // 4. Generar token JWT
            const token = jwt.sign(
                { userId: result.insertId, email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // 5. Retornar datos del usuario (sin password)
            return {
                user: {
                    id: result.insertId,
                    nombre,
                    email
                },
                token
            };
            
        } catch (error) {
            console.error('Error en servicio de registro:', error);
            throw error;
        }
    }
    
    /**
     * Autenticar usuario
     */
    async loginUser(credentials) {
        const { email, password } = credentials;
        
        try {
            // 1. Buscar usuario por email
            const [users] = await pool.execute(
                'SELECT id, nombre, email, password FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (users.length === 0) {
                throw new Error('Credenciales inválidas');
            }
            
            const user = users[0];
            
            // 2. Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Credenciales inválidas');
            }
            
            // 3. Generar token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // 4. Retornar datos (eliminar password)
            delete user.password;
            
            return {
                user,
                token
            };
            
        } catch (error) {
            console.error('Error en servicio de login:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();