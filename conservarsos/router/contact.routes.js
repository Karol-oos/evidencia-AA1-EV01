const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contact.controller');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Mensaje enviado
 */
router.post('/', sendMessage);

module.exports = router;