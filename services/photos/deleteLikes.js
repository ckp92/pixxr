const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async photoId => {
  // delete all likes for that photo
  const deleteLikes = `DELETE FROM likes
    WHERE photo_id = ?`;

  const deleteOkPacket = await usePooledConnection(
    generalQuery,
    deleteLikes,
    [photoId]
  ).catch(error => {
    console.error(error);
    return;
  });

  console.log("DELETE LIKES OK PACKET: ", deleteOkPacket);
};
