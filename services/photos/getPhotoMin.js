const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const getMinProperties = require("./getMinProperties");

module.exports = async (photoId, currentUserId) => {
  const getPhotoStr = `SELECT * FROM photos WHERE id = ?`;

  const getPhotoRows = await usePooledConnection(generalQuery, getPhotoStr, [
    photoId
  ]).catch(error => {
    console.error(error);
    return {
      status: 500,
      error,
      message: "There was an error fetching the photo. Please try again.",
      data: []
    };
  });

  // return this if there's no data
  if (!getPhotoRows.length) {
    return {
      status: 404,
      error: true,
      message: "Can't find that photo",
      data: []
    };
  }

  const data = await getMinProperties(getPhotoRows[0], currentUserId).catch(
    error => {
      console.error(error);
      return {
        status: 500,
        error,
        message: "There was an error fetching the photo. Please try again.",
        data: []
      };
    }
  );

  // return obj depending on whether we managed to get photos from db
  if (data.id) {
    return {
      status: 200,
      error: false,
      message: "Success!",
      data: [data]
    };
  } else {
    return {
      status: 204,
      error: false,
      message: "There's no photos here!",
      data: []
    };
  }
};
