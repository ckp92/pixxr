const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");
const checkHaveILiked = require("./checkHaveILiked");
const getUserById = require("./getUserById");

module.exports = async (id, currentUserId) => {
  const getPhotoStr = `SELECT * FROM photos WHERE id = ?`;

  const photoRows = await usePooledConnection(generalQuery, getPhotoStr, [
    id
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
  if (!photoRows.length) {
    return {
      status: 404,
      error: true,
      message: "Can't find that photo",
      data: []
    };
  }

  // get username
  const user = await getUserById(photoRows[0].user_id);
  const { username } = user;

  // get all the tags
  const getTagsQueryStr = `SELECT tag_name FROM tags
    INNER JOIN photo_tags
    ON tags.id = photo_tags.tag_id
    WHERE photo_id = ?`;

  const tagRows = await usePooledConnection(generalQuery, getTagsQueryStr, [
    id
  ]).catch(error => {
    console.error(error);
    return [];
  });

  const tags = tagRows.map(row => row.tag_name);

  // get all the likes
  const getLikesQueryStr = `SELECT username FROM users
    INNER JOIN likes
    ON users.id = likes.user_id
    WHERE photo_id = ?;`;

  const likeRows = await usePooledConnection(generalQuery, getLikesQueryStr, [
    id
  ]).catch(error => {
    console.error(error);
    return [];
  });

  const likes = likeRows.map(row => row.username);

  // find out if current user has liked it
  const haveILiked = await checkHaveILiked(currentUserId, id);

  // get all the comments
  const getCommentsQueryStr = `SELECT 
    username, comments.id, comment_text, comments.user_id, comments.created_at 
    FROM comments 
    INNER JOIN photos 
    ON comments.photo_id = photos.id 
    INNER JOIN users 
    ON users.id = comments.user_id 
    WHERE photo_id = ?;`;

  const commentsRows = await usePooledConnection(
    generalQuery,
    getCommentsQueryStr,
    [id]
  ).catch(error => {
    console.error(error);
    return [];
  });

  const data = [
    {
      ...photoRows[0],
      username,
      tags,
      likes,
      haveILiked,
      comments: commentsRows
    }
  ];

  return {
    status: 200,
    error: false,
    message: "Success",
    data
  };
};
