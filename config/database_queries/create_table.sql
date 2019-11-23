CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE local_account (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_pass CHAR(60),
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
  -- hashed_pass VARCHAR(60),

  

-- SELECT * FROM users
--     INNER JOIN local_account
--     ON users.id = local_account.user_id;


CREATE TABLE google_account (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  google_email VARCHAR(255) UNIQUE NOT NULL,
  google_name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES users(id)
);