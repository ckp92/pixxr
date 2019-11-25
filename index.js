const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const morgan = require("morgan");

const keys = require("./config/keys");

require("./services/passport");

const app = express();

// APP CONFIG ------------------------------------------------------------------------------------------

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookieSession
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey]
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// // tell express to trust the proxy
app.enable("trust proxy");

// log requests
app.use(morgan("combined"));

// ROUTES -----------------------------------------------------------------------------------------------

// testing - DELETE AFTER
app.get("/hello", (req, res) => {
  res.send({ hello: "world!" });
});

// auth
require("./routes/authRoutes")(app);

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

// START SERVER ------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening @ ${PORT}`));
