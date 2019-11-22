const express = require("express");
const mysql = require("mysql");
const keys = require("./config/keys");
const dbConfig = require("./config/dbConfig");

// const connection = mysql.createConnection(dbConfig.connection);
// connection.connect(err => {
//   if (err) {
//     console.error("error connecting: " + err.stack);
//     return;
//   }

//   console.log("connected as id " + connection.threadId);
// });

// const queries = ["SHOW DATABASES", "SELECT DATABASE()", "SHOW TABLES"];

// queries.forEach(query =>
//   connection.query(query, (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   })
// );

// connection.end();

const app = express();

app.get("/hello", (req, res) => {
  res.send({ hello: "world!" });
});

// make express behave correctly in production environment
if (process.env.NODE_ENV === "production") {
  // serve static files from the React app
  app.use(express.static("client/build"));

  // tell express to serve up 'index.html' if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening @ ${PORT}`));
