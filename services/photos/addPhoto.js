const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const addTags = require("./addTags");

module.exports = async (formValues, userId) => {
  const { imgUrl, imgTitle, imgTags } = formValues;
  // add the photo to the db
  const addPhotoQueryStr = `INSERT INTO photos(image_url, title, user_id) VALUES(?, ?, ?)`;
  const addPhotoOkPacket = await usePooledConnection(
    generalQuery,
    addPhotoQueryStr,
    [imgUrl, imgTitle, userId]
  ).catch(error => {
    console.error(error);
    return {
      status: 500,
      error,
      message: "Error saving photo to db. Please try again"
    };
  });

  const photoId = addPhotoOkPacket.insertId;

  // add tags to db
  await addTags(imgTags, photoId);

  // return insertId which will be used to get the photo object
  return addPhotoOkPacket.insertId;
};
