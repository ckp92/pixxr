const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const getMinProperties = require("./getMinProperties");

module.exports = async (
  page,
  currentUserId,
  searchType = null,
  value = null
) => {
  const limit = 5;
  let getPhotosQueryStr = `SELECT * FROM photos 
    ORDER BY created_at DESC 
    LIMIT ? 
    OFFSET ?`;

  let getPhotosArgs = [limit, page * limit];

  // change variables if we want to find photos of a certian user (might have user with id 0)
  if (searchType === "user") {
    getPhotosQueryStr = `SELECT * FROM photos 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? 
      OFFSET ?`;
    getPhotosArgs.unshift(value);
  }

  // get 5 photos
  const rows = await usePooledConnection(
    generalQuery,
    getPhotosQueryStr,
    getPhotosArgs
  ).catch(error => {
    console.error(error);
    return {
      status: 500,
      error,
      message: "There was an error fetching the photos. Please try again.",
      data: []
    };
  });

  // get the various properties for each
  const data = await Promise.all(
    rows.map(async row => await getMinProperties(row, currentUserId))
  );

  // return obj depending on whether we managed to get photos from db
  if (data.length) {
    return {
      status: 200,
      error: false,
      message: "Success!",
      data
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
