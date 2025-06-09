const express = require('express');
const app = express();
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const autenticarToken = require('./middlewares/authMiddleware'); // importe aqui o middleware

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

// Rota pública
app.get('/', (req, res) => res.send('API TO-DO rodando 🚀'));

// Rota protegida, usando o middleware
app.get('/api/perfil', autenticarToken, (req, res) => {
  res.json({ mensagem: `Olá usuário ${req.usuario.id}, seu token é válido!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
