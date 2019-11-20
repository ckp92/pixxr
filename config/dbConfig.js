const keys = require("./keys");
// configuration for our db
module.exports = {
  connection: {
    host: keys.rdsHost,
    user: keys.rdsUser,
    password: keys.rdsPass,
    database: keys.rdsDB
  },
  tables: {
    users: "users",
    photos: "photos",
    likes: "likes",
    comments: "comments",
    tags: "tags",
    photoTags: "photo_tags"
  }
};
