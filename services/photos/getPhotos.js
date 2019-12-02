const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (page, userId = null) => {
  const limit = 5;
  let getPhotosQueryStr = `SELECT * FROM photos 
    ORDER BY created_at DESC 
    LIMIT ? 
    OFFSET ?`;

  let getPhotosArgs = [limit, page * limit];

  // change variables if user wants to find their own photos (might have user with id 0)
  if (userId || userId === 0) {
    getPhotosQueryStr = `SELECT * FROM photos 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? 
      OFFSET ?`;
    getPhotosArgs.unshift(userId);
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
      data: null
    };
  });

  // get the tags for each
  const data = await Promise.all(
    rows.map(async row => {
      // get tagNames
      const getTagsQueryStr = `SELECT tag_name FROM tags 
        INNER JOIN photo_tags 
        ON tags.id = photo_tags.tag_id 
        WHERE photo_id = ?`;

      const tags = await usePooledConnection(generalQuery, getTagsQueryStr, [
        row.id
      ]).catch(error => {
        console.error(error);
        return [];
      });

      const tagNames = tags.map(tag => tag.tag_name);

      // get numLikes
      const getNumLikesStr = `SELECT 
        COUNT(*) AS num_likes
        FROM likes 
        INNER JOIN photos 
        ON likes.photo_id = photos.id 
        WHERE photos.id = ?`;

      const numLikesRows = await usePooledConnection(
        generalQuery,
        getNumLikesStr,
        [row.id]
      ).catch(error => {
        console.error(error);
        return null;
      });

      // get numComments
      // double check this str
      const getNumCommentsStr = `SELECT 
        COUNT(*) AS num_comments
        FROM comments
        INNER JOIN photos
        ON comments.photo_id = photos.id
        WHERE photos.id = ?;`;

      const numCommentsRows = await usePooledConnection(
        generalQuery,
        getNumCommentsStr,
        [row.id]
      ).catch(error => {
        console.error(error);
        return null;
      });

      return {
        ...row,
        tagNames,
        numLikes: numLikesRows[0].num_likes,
        numComments: numCommentsRows[0].num_comments
      };
    })
  );

  // return obj
  return {
    status: 200,
    error: false,
    message: "Success!",
    data
  };
};
