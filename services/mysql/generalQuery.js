module.exports = async (connection, queryStr, args) => {
  const result = await new Promise((resolve, reject) => {
    connection.query(queryStr, args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return result;
};

// args is an optional argument in the main function (usePooledConnection()). if not specified, it will be passed to generalQuery() as 'null'
// if it's null, we can still pass it to connection.query and it will still work.
// this means we can use generalQuery() for both queries WITH and WITHOUT selector values.
