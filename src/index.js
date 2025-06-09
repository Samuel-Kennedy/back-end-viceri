const express = require('express');
const app = express();
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes'); // importe as rotas de tarefas
const autenticarToken = require('./middlewares/authMiddleware'); // middleware de autenticação

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tarefas', tarefaRoutes); // rotas protegidas de tarefas

// Rota pública
app.get('/', (req, res) => res.send('API TO-DO rodando 🚀'));

// Rota protegida, usando o middleware
app.get('/api/perfil', autenticarToken, (req, res) => {
  res.json({ mensagem: `Olá usuário ${req.usuario.id}, seu token é válido!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
