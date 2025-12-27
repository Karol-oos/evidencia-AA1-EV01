// contact.controllers.js
const ContactService = require('../services/contact.service');

class ContactController {
    // Crear un nuevo contacto/consulta
    async createContact(req, res) {
        try {
            const contactData = req.body;
            
            // Validación básica
            if (!contactData.name || !contactData.email || !contactData.message) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y mensaje son requeridos'
                });
            }

            const newContact = await ContactService.createContact(contactData);
            
            res.status(201).json({
                success: true,
                message: 'Consulta enviada exitosamente',
                data: newContact
            });
        } catch (error) {
            console.error('Error al crear contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al procesar la consulta',
                error: error.message
            });
        }
    }

    // Obtener todas las consultas (solo admin)
    async getAllContacts(req, res) {
        try {
            const contacts = await ContactService.getAllContacts();
            
            res.status(200).json({
                success: true,
                data: contacts
            });
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las consultas',
                error: error.message
            });
        }
    }

    // Obtener un contacto por ID (solo admin)
    async getContactById(req, res) {
        try {
            const { id } = req.params;
            const contact = await ContactService.getContactById(id);
            
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Consulta no encontrada'
                });
            }
            
            res.status(200).json({
                success: true,
                data: contact
            });
        } catch (error) {
            console.error('Error al obtener contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la consulta',
                error: error.message
            });
        }
    }

    // Actualizar estado de una consulta (solo admin)
    async updateContactStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            // Validar estado
            const validStatuses = ['pending', 'read', 'replied'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado no válido'
                });
            }
            
            const updatedContact = await ContactService.updateContactStatus(id, status);
            
            if (!updatedContact) {
                return res.status(404).json({
                    success: false,
                    message: 'Consulta no encontrada'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Estado actualizado exitosamente',
                data: updatedContact
            });
        } catch (error) {
            console.error('Error al actualizar contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la consulta',
                error: error.message
            });
        }
    }

    // Eliminar una consulta (solo admin)
    async deleteContact(req, res) {
        try {
            const { id } = req.params;
            const deletedContact = await ContactService.deleteContact(id);
            
            if (!deletedContact) {
                return res.status(404).json({
                    success: false,
                    message: 'Consulta no encontrada'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Consulta eliminada exitosamente',
                data: deletedContact
            });
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la consulta',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de contactos (solo admin)
    async getContactStats(req, res) {
        try {
            const contacts = await ContactService.getAllContacts();
            
            const stats = {
                total: contacts.length,
                pending: contacts.filter(c => c.status === 'pending').length,
                read: contacts.filter(c => c.status === 'read').length,
                replied: contacts.filter(c => c.status === 'replied').length
            };
            
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    }
}

module.exports = new ContactController();