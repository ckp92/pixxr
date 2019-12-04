const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (userId, photoId) => {
  const checkHaveILikedStr = `SELECT 
  COUNT(*) AS my_like
  FROM likes
  WHERE user_id = ?
  && photo_id = ?`;

  const rows = await usePooledConnection(generalQuery, checkHaveILikedStr, [
    userId,
    photoId
  ]).catch(e => {
    console.error(e);
    return [{ my_like: 0 }];
  });

  // console.log(rows[0].my_like)
  // turn into bool (just incase there's some weird bug)
  return !!rows[0].my_like;
};
