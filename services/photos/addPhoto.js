const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

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

  // for each tag: insert into tags if doesn't already exist
  const imgTagsArray = imgTags.split(",").map(tag => tag.trim());
  const insertIgnoreTagsStr = `INSERT IGNORE INTO tags (tag_name) VALUES(?)`;
  const insertPhotoTagsStr = `INSERT INTO photo_tags(photo_id, tag_id) VALUES (?, ?)`;
  const getTagIdQueryStr = `SELECT id FROM tags WHERE tag_name = ?`;

  await imgTagsArray.forEach(async tag => {
    // INSERT IGNORE THE TAG
    const okPacketTag = await usePooledConnection(
      generalQuery,
      insertIgnoreTagsStr,
      [tag]
    ).catch(error => {
      console.error(error);
    });

    // get the tagId depending on whether it's new or existing
    let tagId = null;
    if (okPacketTag.affectedRows) {
      // if new, just get the insertId
      tagId = okPacketTag.insertId;
    } else {
      // if existing, get it using a query
      const rows = await usePooledConnection(generalQuery, getTagIdQueryStr, [
        tag
      ]).catch(e => console.error(e));
      tagId = rows[0].id;
    }

    // add tag to phototags table
    const okPacketPhotoTag = await usePooledConnection(
      generalQuery,
      insertPhotoTagsStr,
      [photoId, tagId]
    ).catch(error => console.error(error));
  });

  // return insertId which will be used to get the photo object
  return addPhotoOkPacket.insertId;
};
