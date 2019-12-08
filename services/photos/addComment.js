const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (userId, photoId, commentText) => {
  const addCommentStr = `INSERT INTO comments
    (comment_text, user_id, photo_id)
    VALUES(?, ?, ?)`;

  const addCommentOkPacket = await usePooledConnection(
    generalQuery,
    addCommentStr,
    [commentText, userId, photoId]
  ).catch(error => {
    console.error(error);
  });

  console.log(addCommentOkPacket);
};
