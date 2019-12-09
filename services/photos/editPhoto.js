const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const addTags = require("./addTags");

module.exports = async (reqBody, photoId) => {
  const { imgUrl, imgTitle, imgTags } = reqBody;

  // update url and title
  const updatePhotoStr = `UPDATE photos SET image_url = ?, 
    title = ? 
    WHERE id = ?`;

  const updateArgs = [imgUrl, imgTitle, photoId];

  console.log(updateArgs);

  const updateOkPacket = await usePooledConnection(
    generalQuery,
    updatePhotoStr,
    updateArgs
  ).catch(error => {
    console.error(error);
    return;
  });

  console.log("UPDATE OK PACKET: ", updateOkPacket);

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

  console.log("DELETE OK PACKET: ", deleteOkPacket);

  // add tags back
  await addTags(imgTags, photoId);
};
