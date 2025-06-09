const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

if (!config[environment]) {
  throw new Error(`Configuração do ambiente '${environment}' não encontrada no knexfile.js`);
}

const connection = knex(config[environment]);

module.exports = connection;
