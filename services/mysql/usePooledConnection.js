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

// USEAGE ------------------------------------------------------------------------------------------

// USEAGE create the query function
const queryFunction = async (connection, queryStr, args) => {
  const rows = await new Promise((resolve, reject) => {
    connection.query(queryStr, args, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
    return rows;
  });
};

// USEAGE NO EXTRA ARGS -----------------------------------------------------------------------------------------

// USEAGE use the pooled connection and pass it queryFunction and the queryStr
const doSomething = async queryStr => {
  const result = await usePooledConnection(queryFunction, queryStr);
  console.log(result);
};

const queryStr = "SELECT * FROM USERS";

// call
// doSomething(queryStr)

// USEAGE ARGS -----------------------------------------------------------------------------------------

// USEAGE use pooled function and pass it queryFunction, queryStr2, args
const doSomethingElse = async (queryStr, args) => {
  const result = await usePooledConnection(queryFunction, queryStr, args);
  console.log(result);
};

const queryStr2 =
  "INSERT INTO local_account(email, hashed_pass, user_id) VALUES(?, ?, ?)";
const args = ["chintan@gmail.com", "myPassword", 13];

// call with array of args
// doSomethingElse(queryStr2, args);
