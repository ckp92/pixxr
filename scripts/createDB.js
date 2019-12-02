// script to create database tables
const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");

const tables = [
  // users table
  `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    username VARCHAR(255) NOT NULL,
    hash CHAR(60),
    external_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );`,

  // contact messages
  `CREATE TABLE contact_messages (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    return_email VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    successfully_delivered BOOLEAN,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`,

  // photos table
  `CREATE TABLE photos (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`,

  // likes table
  `CREATE TABLE likes (
    user_id INTEGER NOT NULL,
    photo_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    PRIMARY KEY(user_id, photo_id)
  );`,

  // comments table
  `CREATE TABLE comments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    comment_text TEXT NOT NULL,
    photo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`,

  // tags table
  `CREATE TABLE tags (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  );`,

  // photoTags table
  `CREATE TABLE photo_tags (
    photo_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    PRIMARY KEY(photo_id, tag_id)
  );`
];

const createTables = async () => {
  for (let i = 2; i < 3; i++) {
    try {
      const okDataPacket = await usePooledConnection(generalQuery, tables[i]);
      console.log(okDataPacket);
    } catch (error) {
      console.error(`Error with table ${i + 1}`, error);
    }
  }
};

// createTables();

const insertTagStr = `INSERT IGNORE INTO tags (tag_name) VALUES(?)`;

const insertTag = async () => {
  console.log("inserting");
  const okDataPacket = await usePooledConnection(generalQuery, insertTagStr, [
    "food"
  ]).catch(e => console.error(e));

  console.log(okDataPacket);
};

// insertTag();
