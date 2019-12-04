const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async userId => {
  const getUserStr = `SELECT * FROM users WHERE id = ?`;

  const userRows = await usePooledConnection(generalQuery, getUserStr, [
    userId
  ]).catch(error => {
    console.error(error);
    return [{ username: "User" }];
  });

  return userRows[0];
};
