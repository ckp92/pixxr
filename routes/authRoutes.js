const passport = require("passport");

module.exports = app => {
  // LOCAL SIGNUP ROUTE ------------------------------------------------------------------------------
  app.post("/auth/signup", (req, res, next) => {
    passport.authenticate("local-signup", (e, user, info) => {
      if (e) return next(e);
      if (info) return res.send(info); // error message, if exists

      // log the user in
      req.logIn(user, async e => {
        if (e) return next(e);
        return res.redirect("/photos");
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
        return res.redirect("/photos");
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
      if (req.user.username) {
        res.redirect("/photos");
      } else {
        res.redirect("/docs");
      }
    }
  );
  // FACEBOOK AUTH ROUTES -------------------------------------------------------------------------------------
  // if username is null (they just signed up), show a modal where they must provide one;
  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      if (req.user.username) {
        res.redirect("/photos");
      } else {
        res.redirect("/docs");
      }
    }
  );

  // LOGOUT ROUTE -------------------------------------------------------------------------------------------
  app.get("/api/logout", (req, res) => {
    req.logOut();
    console.log("Logged Out");
    res.send({ logged: "out" }); // only while app is still in development
    // res.redirect("/landing"); // uncomment once auth is all working properly
  });

  // USER DETAILS ROUTE -------------------------------------------------------------------------------------
  app.get("/api/user", (req, res) => {
    console.log(req.user);
    res.send(req.user);
  });
};
