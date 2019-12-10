const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async photoId => {
  // delete all comments for that photo
  const deleteComments = `DELETE FROM comments
    WHERE photo_id = ?`;

  const deleteOkPacket = await usePooledConnection(
    generalQuery,
    deleteComments,
    [photoId]
  ).catch(error => {
    console.error(error);
    return;
  });

  console.log("DELETE COMMENTS OK PACKET: ", deleteOkPacket);
};
