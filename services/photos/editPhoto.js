const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const addTags = require("./addTags");
const deleteTags = require("./deleteTags");

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
  await deleteTags(photoId);

  // add tags back
  await addTags(imgTags, photoId);
};
