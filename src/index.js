const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const usuarioRoutes = require('./routes/usuarioRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const autenticarToken = require('./middlewares/authMiddleware');

app.use(cors());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API To-Do App - Viceri",
      version: "1.0.0",
      description: "Documentação da API To-Do App feita com Node.js, Express e SQLite",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ["./src/routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tarefas', tarefaRoutes);

app.get('/', (req, res) => res.send('API TO-DO rodando 🚀'));
/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Retorna perfil do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */

app.get('/api/perfil', autenticarToken, (req, res) => {
  res.json({ mensagem: `Olá usuário ${req.usuario.id}, seu token é válido!` });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));

module.exports = { app, server };

