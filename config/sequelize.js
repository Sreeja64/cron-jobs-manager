const {DB_NAME,DB_USER,DB_DIALECT,DB_PORT,DB_PASSWORD,ENV} = require('./environment')
const Sequelize = require("sequelize");
const SQLite = require("sqlite3");

module.exports = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
      storage: ENV=='LOCAL'?'cronjob.db':'/var/lib/db/cronjobnew.db',
      dialect: DB_DIALECT,
      dialectOptions: {mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,},
    }
  );

