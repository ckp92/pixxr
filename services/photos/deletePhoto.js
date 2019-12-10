const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const deleteTags = require("./deleteTags");
const deleteComments = require("./deleteComments");
const deleteLikes = require("./deleteLikes");

module.exports = async photoId => {
  // delete tags if any
  await deleteTags(photoId);

  // delete comments if any
  await deleteComments(photoId);

  // delete likes if any
  await deleteLikes(photoId);

  // delete the photo last b/c it's a foreign key to others
  const deletePhotoStr = `DELETE FROM photos WHERE id = ?`;

  const deletePhotoOkpacket = await usePooledConnection(
    generalQuery,
    deletePhotoStr,
    [photoId]
  ).catch(error => {
    console.error(error);
    return;
  });

  console.log("DELETE PHOTO PACKET: ", deletePhotoOkpacket);
};
