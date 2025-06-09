const path = require('path');

const baseConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'banco.sqlite'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
  },
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
};
