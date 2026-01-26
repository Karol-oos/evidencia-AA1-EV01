const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Ruta para enviar mensaje de contacto
router.post('/contact', contactController.createContact);

module.exports = router;