const pool = require("../../config/dbConfig").pool;

// asyncAction will be a function which will be given 'connection' & 'queryStr' as args
// and OPTIONALLY an array of args as a third argument - will alow it to work for queries where we don't need to specify certain selector values
module.exports = async (asyncAction, queryStr, args = null) => {
  // make connection
  const connection = await new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });

  try {
    // call the asyncAction function and pass it 'connection', 'queryStr', 'args'
    return await asyncAction(connection, queryStr, args);
  } finally {
    // end the connection
    connection.release();
  }
};
