// script to create database tables
const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");
const { users, photos, likes, comments, tags, photoTags } = dbConfig.tables;

const connection = mysql.createConnection(dbConfig.connection);

connection.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const tables = [
  // users table
  `CREATE TABLE ${users} (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`,

  // photos table
  `CREATE TABLE ${photos} (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`,

  // likes table
  `CREATE TABLE ${likes} (
    user_id INTEGER NOT NULL,
    photo_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    PRIMARY KEY(user_id, photo_id)
  );`,

  // comments table
  `CREATE TABLE ${comments} (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    comment_text VARCHAR(255) NOT NULL,
    photo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`,

  // tags table
  `CREATE TABLE ${tags} (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  );`,

  // phptoTags table
  `CREATE TABLE ${photoTags} (
    photo_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    PRIMARY KEY(photo_id, tag_id)
  );`
];

// create the tables
tables.forEach(table =>
  connection.query(table, (err, results, field) => {
    if (err) throw err;
    console.log(results);
  })
);

connection.end();
