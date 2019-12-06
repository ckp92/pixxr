const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (photoId, userId, value) => {
  let toggleLikeStr = null;

  // if value is true, we want to insert a like
  if (value) {
    toggleLikeStr = `INSERT INTO likes(user_id, photo_id) 
    VALUES (?, ?)`;
  } else {
    toggleLikeStr = `DELETE FROM likes 
    WHERE user_id = ? 
    && photo_id = ?`;
  }

  const okPacket = await usePooledConnection(generalQuery, toggleLikeStr, [
    userId,
    photoId
  ]).catch(error => console.error(error));

  console.log("toggleLike result: ", okPacket);
};
