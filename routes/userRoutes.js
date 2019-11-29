const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");
const removeSensitiveData = require("../services/removeSensitiveData");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  // USER DETAILS ROUTES -------------------------------------------------------------------------------------

  // get user
  app.get("/api/user", requireLogin, (req, res) => {
    console.log(req.user);

    // remove hash, external_id properties
    const withoutSensitiveData = removeSensitiveData(req.user);
    res.send(withoutSensitiveData);
  });

  // get user by username (if exists)
  app.post("/api/find_username", async (req, res) => {
    const { username } = req.body;

    const queryStr = `SELECT * FROM users WHERE username = ?`;

    const findUserRows = await usePooledConnection(generalQuery, queryStr, [
      username
    ]);

    res.send(findUserRows);
  });

  // add username
  app.post("/api/set_username", requireLogin, async (req, res) => {
    const { username, id } = req.body;

    const queryStr = `UPDATE users SET username = ? WHERE id = ?`;

    const okDataPacket = await usePooledConnection(generalQuery, queryStr, [
      username,
      id
    ]);

    res.send(okDataPacket);
  });
};
