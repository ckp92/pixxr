const passport = require("passport");
const removeSensitiveData = require("../services/removeSensitiveData");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  // LOCAL SIGNUP ROUTE ------------------------------------------------------------------------------
  app.post("/auth/signup", (req, res, next) => {
    passport.authenticate("local-signup", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // error message, if exists

      // log the user in
      req.logIn(user, async e => {
        if (e) return next(e);

        // remove hash, external_id properties
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

        // remove hash, external_id properties
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
  app.get("/api/logout", requireLogin, (req, res) => {
    req.logOut();
    console.log("Logged Out");
    res.send({ logged: "out" }); // only while app is still in development
    // res.redirect("/"); // uncomment once auth is all working properly
  });
};
