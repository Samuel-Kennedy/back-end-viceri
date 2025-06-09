/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Rotas para gerenciamento de tarefas
 */

/**
 * @swagger
 * /api/tarefas:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados da tarefa para criar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - prioridade
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Comprar leite
 *               descricao:
 *                 type: string
 *                 example: Comprar leite integral no mercado
 *               prioridade:
 *                 type: string
 *                 example: Alta
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Dados inválidos ou faltando campos obrigatórios
 *       401:
 *         description: Token inválido ou não fornecido
 *
 *   get:
 *     summary: Lista tarefas pendentes do usuário autenticado
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     example: Comprar leite
 *                   descricao:
 *                     type: string
 *                     example: Comprar leite integral no mercado
 *                   prioridade:
 *                     type: string
 *                     example: Alta
 *                   status:
 *                     type: string
 *                     example: pendente
 *       401:
 *         description: Token inválido ou não fornecido
 */

const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, tarefaController.criarTarefa);
router.get('/', autenticarToken, tarefaController.listarTarefasPendentes);

module.exports = router;
