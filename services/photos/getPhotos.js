const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const getMinProperties = require("./getMinProperties");

module.exports = async (
  page,
  currentUserId,
  searchType = null,
  value = null
) => {
  const limit = 10;
  let getPhotosQueryStr = `SELECT * FROM photos 
    ORDER BY created_at DESC 
    LIMIT ? 
    OFFSET ?`;

  let getPhotosArgs = [limit, page * limit];

  // change variables if user search
  if (searchType === "user") {
    getPhotosQueryStr = `SELECT * FROM photos 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? 
      OFFSET ?`;
    getPhotosArgs.unshift(value);
  }

  // change variables if tag search
  if (searchType === "tag") {
    getPhotosQueryStr = `SELECT * FROM photos
      INNER JOIN photo_tags
      ON photos.id = photo_tags.photo_id
      INNER JOIN tags
      ON photo_tags.tag_id = tags.id
      WHERE tag_name = ? 
      ORDER BY photos.created_at DESC 
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

  // for tag search, change id to photo_id (as opposed to tag_id)
  if (searchType === "tag") rows.forEach(row => (row.id = row.photo_id));

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
