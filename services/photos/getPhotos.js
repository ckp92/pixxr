const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const checkHaveILiked = require("./checkHaveILiked");
const getUserById = require("./getUserById");

module.exports = async (page, currentUserId, userId = null) => {
  const limit = 20;
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
      data: []
    };
  });

  // get the various properties for each
  const data = await Promise.all(
    rows.map(async row => {
      // get usernames
      const user = await getUserById(row.user_id);
      const { username } = user;

      // get numTags
      const getNumTagsStr = `SELECT 
        COUNT(*) AS num_tags
        FROM tags
        INNER JOIN photo_tags
        ON tags.id = photo_tags.tag_id
        WHERE photo_id = ?`;

      const numTagsRows = await usePooledConnection(
        generalQuery,
        getNumTagsStr,
        [row.id]
      ).catch(error => {
        console.error(error);
        return [{ num_tags: 0 }];
      });

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
        return [{ num_likes: 0 }];
      });

      // find out if current user has liked it
      const haveILiked = await checkHaveILiked(currentUserId, row.id);

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
        return [{ num_comments: 0 }];
      });

      return {
        ...row,
        username,
        numTags: numTagsRows[0].num_tags,
        numLikes: numLikesRows[0].num_likes,
        haveILiked,
        numComments: numCommentsRows[0].num_comments
      };
    })
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
