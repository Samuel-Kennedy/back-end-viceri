const request = require('supertest');
const { app, server } = require('../src/index');

describe('Testa rotas básicas do servidor', () => {
  afterAll(done => {
    server.close(done);
  });

  it('GET / deve responder com mensagem de status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('API TO-DO rodando 🚀');
  });
});
