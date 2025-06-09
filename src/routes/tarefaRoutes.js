const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const autenticarToken = require('../middlewares/authMiddleware'); // mesmo middleware que você já tem

router.post('/', autenticarToken, tarefaController.criarTarefa);
router.get('/', autenticarToken, tarefaController.listarTarefasPendentes);

module.exports = router;
