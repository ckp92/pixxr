const mysql = require("mysql");
const keys = require("./keys");

// configuration for our db
module.exports = {
  pool: mysql.createPool({
    connectionLimit: 10,
    host: keys.rdsHost,
    user: keys.rdsUser,
    password: keys.rdsPass,
    database: keys.rdsDB
  })
};
