const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API To-Do App - Viceri",
      version: "1.0.0",
      description: "Documentação da API To-Do App feita com Node.js, Express e SQLite",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
