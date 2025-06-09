const connection = require('../src/database/connection');

describe('Conexão com o banco', () => {
  it('deve estar definida', () => {
    expect(connection).toBeDefined();
  });

  it('deve ser um objeto knex', () => {
    expect(typeof connection.raw).toBe('function');
  });

  it('deve conseguir rodar uma query simples', async () => {
    const result = await connection.raw('SELECT 1+1 AS result');
    expect(result).toBeDefined();
  });
});
