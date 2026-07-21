require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: 'localhost',
      port: 5432,
      user: 'jecsan',
      password: 'dev_password_change_in_production',
      database: 'realtradenews'
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
