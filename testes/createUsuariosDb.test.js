const knexLib = require('knex');
const migrationUsuarios = require('../src/database/migrations/20250609_create_usuarios');

describe('Migration tabela usuarios', () => {
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

  it('deve criar e remover a tabela usuarios com up() e down()', async () => {
    await migrationUsuarios.up(knex);
    let existe = await knex.schema.hasTable('usuarios');
    expect(existe).toBe(true);

    await migrationUsuarios.down(knex);
    existe = await knex.schema.hasTable('usuarios');
    expect(existe).toBe(false);
  });
});
