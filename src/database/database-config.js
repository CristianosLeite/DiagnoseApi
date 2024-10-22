const { Sequelize } = require("sequelize");

const dbConfig = {
  host: process.env["HOST_DATABASE"] || "localhost",
  user: process.env["USERNAME_DATABASE"] || "postgres",
  password: process.env["PASSWORD_DATABASE"] || "postgres",
  db: process.env["DATABASE_NAME"] || "postgres",
  dialect: process.env["DIALECT_DATABASE"] || "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

module.exports = { dbConfig, sequelize };
