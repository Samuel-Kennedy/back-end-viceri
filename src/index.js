const express = require('express');
const app = express();
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => res.send('API TO-DO rodando 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
