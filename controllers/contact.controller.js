const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contact.controller');

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
 *         description: Mensaje enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mensaje enviado correctamente"
 *       400:
 *         description: Error en la validación
 */
router.post('/', sendContactMessage);

module.exports = router;