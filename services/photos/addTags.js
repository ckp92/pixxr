const usePooledConnection = require("../mysql/usePooledConnection");
const generalQuery = require("../mysql/generalQuery");

module.exports = async (imgTags, photoId) => {
  // for each tag: remove blanks (trailing comma) + insert tag into tags if doesn't already exist
  const imgTagsArray = imgTags
    .split(",")
    .filter(tag => tag.toString().trim().length)
    .map(tag => tag.trim());

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
};
