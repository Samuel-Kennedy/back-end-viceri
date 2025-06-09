const knexLib = require('knex');
const migration = require('../src/database/migrations/20250609_create_tarefas');

describe('Migration tabela tarefas', () => {
  let knex;

  beforeAll(() => {
    knex = knexLib({
      client: 'sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('deve criar e remover a tabela tarefas com up() e down()', async () => {
    await migration.up(knex);
    let existe = await knex.schema.hasTable('tarefas');
    expect(existe).toBe(true);

    await migration.down(knex);
    existe = await knex.schema.hasTable('tarefas');
    expect(existe).toBe(false);
  });
});
