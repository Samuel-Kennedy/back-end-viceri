const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // Caminho absoluto construído com base na pasta do knexfile
      filename: path.resolve(__dirname, 'banco.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'migrations')
    }
  }
};
