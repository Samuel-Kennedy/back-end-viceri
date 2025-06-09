const request = require('supertest');
const express = require('express');
const setupSwagger = require('../src/swagger');

const app = express();
setupSwagger(app);

describe('Swagger UI', () => {
  it('deve retornar status 200 na rota /api-docs/ (com barra)', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<title>Swagger UI</title>');
  });

  it('deve seguir redirecionamento e retornar 200 para /api-docs (sem barra)', async () => {
    const res = await request(app).get('/api-docs').redirects(1);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<title>Swagger UI</title>');
  });
});
