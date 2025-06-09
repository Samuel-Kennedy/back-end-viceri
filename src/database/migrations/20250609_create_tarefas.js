exports.up = function(knex) {
  return knex.schema.createTable('tarefas', function(table) {
    table.increments('id').primary();
    table.string('descricao').notNullable();
    table.string('prioridade').notNullable();
    table.integer('usuarioId').unsigned().notNullable()
      .references('id').inTable('usuarios')
      .onDelete('CASCADE');
    table.string('status').defaultTo('pendente');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tarefas');
};
