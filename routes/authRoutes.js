const passport = require("passport");
const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");

module.exports = app => {
  // LOCAL SIGNUP ROUTE ------------------------------------------------------------------------------
  app.post("/auth/signup", (req, res, next) => {
    passport.authenticate("local-signup", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // error message, if exists

      // log the user in
      req.logIn(user, async e => {
        if (e) return next(e);
        return res.send(user);
      });
    })(req, res, next);
  });

  // LOCAL LOGIN ROUTE -------------------------------------------------------------------------------
  app.post("/auth/login", (req, res, next) => {
    passport.authenticate("local-login", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // err message, if exists

      // log the user in
      req.logIn(user, e => {
        if (e) return next(e);
        // send back all user info WITHOUT the hashed_pass
        const { id, type, created_at, local_id, local_email } = user;

        return res.send({
          id,
          type,
          created_at,
          local_id,
          local_email
        });
      });
    })(req, res, next);
  });

  // LOGOUT ROUTE -------------------------------------------------------------------------------------------
  app.get("/api/logout", (req, res) => {
    req.logOut();
    console.log("Logged Out");
    res.redirect("/landing");
  });

  // USER DETAILS ROUTE -------------------------------------------------------------------------------------
  app.get("/api/userdetails", async (req, res) => {
    console.log("req.user is: ", req.user);

    if (req.user) {
      // get the full details
      try {
        const findUsersByIdStr = `SELECT * FROM users
          INNER JOIN local_account
          ON users.id = local_account.local_user_id
          WHERE users.id = ?`;

        const fullDetails = await usePooledConnection(
          generalQuery,
          findUsersByIdStr,
          [req.user.id]
        );
        // send back all info WITHOUT hashed pass
        const { id, type, created_at, local_id, local_email } = fullDetails[0];

        res.send({
          id,
          type,
          created_at,
          local_id,
          local_email
        });
      } catch (error) {
        console.error("Error getting fullDetails for user: ", req.user, error);
        res.status(500).send({ message: "Couldn't get full details" });
      }
    } else {
      res.send(null);
    }
  });
};
