const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await db.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)', 
        [nombre, correo, hashedPassword]);
        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(contrasena, rows[0].contrasena);
        if (!validPass) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: rows[0].id }, 'tu_clave_secreta', { expiresIn: '1h' });
        res.json({ token, usuario: { nombre: rows[0].nombre } });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = { registerUser, loginUser };