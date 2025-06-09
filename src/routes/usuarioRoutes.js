/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas para cadastro e login de usuários
 */

/**
 * @swagger
 * /api/usuarios/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       description: Dados para cadastro
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       description: Email e senha para login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

module.exports = router;
