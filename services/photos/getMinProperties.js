const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const checkHaveILiked = require("./checkHaveILiked");
const getUserById = require("./getUserById");

module.exports = async (photo, currentUserId) => {
  const { id, user_id } = photo;

  // get usernames
  const user = await getUserById(user_id);
  const { username } = user;

  // get numTags
  const getNumTagsStr = `SELECT 
    COUNT(*) AS num_tags
    FROM tags
    INNER JOIN photo_tags
    ON tags.id = photo_tags.tag_id
    WHERE photo_id = ?`;

  const numTagsRows = await usePooledConnection(generalQuery, getNumTagsStr, [
    id
  ]).catch(error => {
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

  const numLikesRows = await usePooledConnection(generalQuery, getNumLikesStr, [
    id
  ]).catch(error => {
    console.error(error);
    return [{ num_likes: 0 }];
  });

  // find out if current user has liked it
  const haveILiked = await checkHaveILiked(currentUserId, id);

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
    [id]
  ).catch(error => {
    console.error(error);
    return [{ num_comments: 0 }];
  });

  return {
    ...photo,
    username,
    numTags: numTagsRows[0].num_tags,
    numLikes: numLikesRows[0].num_likes,
    haveILiked,
    numComments: numCommentsRows[0].num_comments
  };
};
