const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async photoId => {
  // delete all tags for that photo
  const deleteTagsStr = `DELETE FROM photo_tags
    WHERE photo_id = ?`;

  const deleteOkPacket = await usePooledConnection(
    generalQuery,
    deleteTagsStr,
    [photoId]
  ).catch(error => {
    console.error(error);
    return;
  });

  console.log("DELETE TAGS OK PACKET: ", deleteOkPacket);
};
