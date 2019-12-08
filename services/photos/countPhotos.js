const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (searchType = null, value = null) => {
  // build queryStr based on searchType. Default = normal;
  let countStr = `SELECT 
  COUNT(*) AS total
  FROM photos`;

  let args = null;

  // user search
  if (searchType === "user") {
    countStr += `WHERE user_id = ?`;
    args = [value];
  }

  countStr += ";";

  const rows = await usePooledConnection(generalQuery, countStr, args).catch(
    error => {
      console.error(error);
      // return enough for one page if can't count
      // change to 20 after it's done
      return 5;
    }
  );

  return rows[0].total;
};