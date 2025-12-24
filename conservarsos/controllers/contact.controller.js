const pool = require('../config/database');

/**
 * Enviar mensaje de contacto
 */
exports.sendMessage = async (req, res) => {
    try {
        const { nombre, email, telefono, mensaje } = req.body;

        await pool.execute(
            'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono, mensaje]
        );

        res.json({ message: 'Mensaje enviado exitosamente' });
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};