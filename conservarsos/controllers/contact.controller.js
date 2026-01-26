const db = require('../config/database');

exports.createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validar campos
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos' 
            });
        }
        
        // Insertar en base de datos
        const result = await db.query(
            'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
        );
        
        console.log('✅ Contacto guardado:', result.rows[0]);
        
        res.status(201).json({
            success: true,
            message: 'Mensaje enviado correctamente',
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('❌ Error guardando contacto:', error);
        res.status(500).json({ 
            error: 'Error del servidor al guardar el mensaje' 
        });
    }
};