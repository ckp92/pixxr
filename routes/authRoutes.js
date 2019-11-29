const passport = require("passport");
const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");
const removeSensitiveData = require("../services/removeSensitiveData");

module.exports = app => {
  // LOCAL SIGNUP ROUTE ------------------------------------------------------------------------------
  app.post("/auth/signup", (req, res, next) => {
    passport.authenticate("local-signup", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // error message, if exists

      // log the user in
      req.logIn(user, async e => {
        if (e) return next(e);

        // remove hash, esternal_id properties
        const withoutSensitiveData = removeSensitiveData(user);
        return res.send(withoutSensitiveData);
      });
    })(req, res, next);
  });

  // LOCAL LOGIN ROUTE -------------------------------------------------------------------------------
  app.post("/auth/login", (req, res, next) => {
    console.log(req.body);
    passport.authenticate("local-login", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // err message, if exists

      // log the user in
      req.logIn(user, e => {
        if (e) return next(e);

        // remove hash, esternal_id properties
        const withoutSensitiveData = removeSensitiveData(user);
        return res.send(withoutSensitiveData);
      });
    })(req, res, next);
  });

  // GOOGLE AUTH ROUTES -------------------------------------------------------------------------------------
  // if username is null (they just signed up), show a modal where they must provide one;
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/photos");
    }
  );

  // FACEBOOK AUTH ROUTES -------------------------------------------------------------------------------------
  // if username is null (they just signed up), show a modal where they must provide one;
  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      res.redirect("/photos");
    }
  );

  // TWITTER AUTH ROUTES -------------------------------------------------------------------------------------
  // if username is null (they just signed up), show a modal where they must provide one;
  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter"),
    (req, res) => {
      res.redirect("/photos");
    }
  );

  // LOGOUT ROUTE -------------------------------------------------------------------------------------------
  app.get("/api/logout", (req, res) => {
    req.logOut();
    console.log("Logged Out");
    res.send({ logged: "out" }); // only while app is still in development
    // res.redirect("/"); // uncomment once auth is all working properly
  });

  // USER DETAILS ROUTES -------------------------------------------------------------------------------------

  // get user (if logged in)
  app.get("/api/user", (req, res) => {
    console.log(req.user);

    // remove hash, esternal_id properties
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
  app.post("/api/set_username", async (req, res) => {
    const { username, id } = req.body;

    // console.log("body", req.body);

    const queryStr = `UPDATE users SET username = ? WHERE id = ?`;

    const okDataPacket = await usePooledConnection(generalQuery, queryStr, [
      username,
      id
    ]);

    res.send(okDataPacket);
  });
};
