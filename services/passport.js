const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const keys = require("../config/keys");
const usePooledConnection = require("./mysql/usePooledConnection"); // optional args must be array
const generalQuery = require("./mysql/generalQuery");
const createHash = require("./createHash");
const checkPass = require("./checkPass");

// serialize user
passport.serializeUser((user, done) => {
  console.log("serializing: ", user);
  done(null, user.id);
});

// deserialize user
passport.deserializeUser(async (id, done) => {
  const queryStr = `SELECT * FROM users WHERE id = ?`;

  try {
    const rows = await usePooledConnection(generalQuery, queryStr, [id]);
    console.log("Found user to deserialize:", rows);
    done(null, rows[0]);
  } catch (error) {
    console.error("error deserializing:", error);
    done(error);
  }
});

// GLOBAL VARIABLES --------------------------------------------------------------------------------------
const findUserByUsernameStr = `SELECT * FROM users WHERE type = ? && username = ?`;

const findUserByExternalIdStr = `SELECT * FROM users WHERE type = ? && external_id = ?`;

const newNonLocalUserQueryStr =
  "INSERT INTO users(type, external_id) VALUES(?, ?)";

const accountTypeTwitter = "twitter";

// LOCAL SIGNUP ------------------------------------------------------------------------------------------
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      proxy: true
    },
    async (username, password, done) => {
      const type = "local";
      if (username) username = username.toLowerCase();

      // find user in db with that username
      const findUserRows = await usePooledConnection(
        generalQuery,
        findUserByUsernameStr,
        [type, username]
      ).catch(error => {
        console.error("Error checking if local user already exists: ", error);
        return done(err);
      });

      // don't make new user if username already exists in db
      if (findUserRows.length) {
        console.log(
          `Local username already exists in db: ${findUserRows[0]}. Sending error message...`
        );
        return done(null, false, { message: "username already exists" });
      }

      // continue and make new user if username doesn't already exist in db
      console.log(
        `Local username ('${username}') doesn't already exist in db. Making new user...`
      );

      // build query str
      const newLocalUserQueryStr =
        "INSERT INTO users(type, username, hash) VALUES(?, ?, ?)";

      // get hash of password
      const hash = await createHash(password);

      // add new user to 'users'
      const newUserOkPacket = await usePooledConnection(
        generalQuery,
        newLocalUserQueryStr,
        [type, username, hash]
      ).catch(error => {
        console.error("Error adding new local user to 'users': ", error);
        return done(err);
      });

      // new user successfully added to 'users'
      console.log("New user added successfully to 'users': ", newUserOkPacket);

      // build newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type,
        username,
        hash,
        external_id: null
      };

      // return
      return done(null, newUser);
    }
  )
);

// LOCAL LOGIN ---------------------------------------------------------------------------------------------
passport.use(
  "local-login",
  new LocalStrategy(
    {
      proxy: true
    },
    async (username, password, done) => {
      const type = "local";
      if (username) username = username.toLowerCase();

      // find user in the db
      const findUserRows = await usePooledConnection(
        generalQuery,
        findUserByUsernameStr,
        [type, username]
      ).catch(error => {
        console.error(
          `Error finding local user ('${username}') in database: `,
          error
        );
        return done(err);
      });

      // no user found in db
      if (!findUserRows.length) {
        console.log(
          `Local username ('${username}') doesn't exist in db. Sending error message...`
        );
        return done(null, false, { message: "Account doesn't exist" });
      }

      // user found in db
      console.log(
        `Local username ('${username}') found in db. Checking pass...`
      );

      // compare passwords
      const passwordFeedback = await checkPass(password, findUserRows[0].hash);
      console.log("passwordFeedback: ", passwordFeedback);

      switch (passwordFeedback) {
        case "incorrect":
        case "checkPassError":
          console.error(passwordFeedback);
          return done(null, false, { message: passwordFeedback });
        // correct pass
        default:
          console.log("Pass correct. Logging in...");
          return done(null, findUserRows[0]);
      }
    }
  )
);

// GOOGLE --------------------------------------------------------------------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id } = profile;
      const type = "google";

      // find user in db with that googleID
      const findUserRows = await usePooledConnection(
        generalQuery,
        findUserByExternalIdStr,
        [type, id]
      ).catch(error => {
        console.error("Error checking if Google user already exists: ", error);
        return done(err);
      });

      // break out of callback and proceed forwards if googleID already exists in db
      if (findUserRows.length) {
        console.log(`GoogleID found in db: ${findUserRows[0]} Logging in...`);
        return done(null, findUserRows[0]);
      }

      // continue and make new user if googleID doesn't already exist in db
      console.log(
        `GoogleID ('${id}') doesn't already exist in db. Making new user....`
      );

      // add new user to 'users'
      const newUserOkPacket = await usePooledConnection(
        generalQuery,
        newNonLocalUserQueryStr,
        [type, id]
      ).catch(error => {
        console.error("Error adding new Google user to 'users': ", error);
        return done(err);
      });

      // new user successfully added to 'users'
      console.log(
        "New Google user added successfully to 'users': ",
        newUserOkPacket
      );

      // build newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type,
        username: null,
        hash: null,
        external_id: id
      };

      // return
      return done(null, newUser);
    }
  )
);

// FACEBOOK -------------------------------------------------------------------------------------------
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientId,
      clientSecret: keys.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id } = profile;
      const type = "facebook";

      // find user in db with that facebookID
      const findUserRows = await usePooledConnection(
        generalQuery,
        findUserByExternalIdStr,
        [type, id]
      ).catch(error => {
        console.error(
          "Error checking if Facebook user already exists: ",
          error
        );
        return done(err);
      });

      // break out of callback and proceed forwards if facebookID already exists in db
      if (findUserRows.length) {
        console.log(`FacebookID found in db: ${findUserRows[0]} Logging in...`);
        return done(null, findUserRows[0]);
      }

      // continue and make new user if facebookID doesn't already exist in db
      console.log(
        `FacebookID ('${id}') doesn't already exist in db. Making new user....`
      );

      // add new user to 'users'
      const newUserOkPacket = await usePooledConnection(
        generalQuery,
        newNonLocalUserQueryStr,
        [type, id]
      ).catch(error => {
        console.error("Error adding new Facebook user to 'users': ", error);
        return done(err);
      });

      // new user successfully added to 'users'
      console.log(
        "New Facebook user added successfully to 'users': ",
        newUserOkPacket
      );

      // build newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type,
        username: null,
        hash: null,
        external_id: id
      };

      // return
      return done(null, newUser);
    }
  )
);

// TWITTER -----------------------------------------------------------------------------------------------
passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.twitterClientId,
      consumerSecret: keys.twitterClientSecret,
      callbackURL: "/auth/twitter/callback",
      proxy: true
    },
    async (token, tokenSecret, profile, done) => {
      const { id } = profile;
      const type = "twitter";

      // find user in db with that twitterID
      const findUserRows = await usePooledConnection(
        generalQuery,
        findUserByExternalIdStr,
        [type, id]
      ).catch(error => {
        console.error("Error checking if Twitter user already exists: ", error);
        return done(err);
      });

      // break out of callback and proceed forwards if twitterID already exists in db
      if (findUserRows.length) {
        console.log(`TwitterID found in db: ${findUserRows[0]} Logging in...`);
        return done(null, findUserRows[0]);
      }

      // continue and make new user if twitterID doesn't already exist in db
      console.log(
        `TwitterID ('${id}') doesn't already exist in db. Making new user....`
      );

      // add new user to 'users'
      const newUserOkPacket = await usePooledConnection(
        generalQuery,
        newNonLocalUserQueryStr,
        [type, id]
      ).catch(error => {
        console.error("Error adding new Twitter user to 'users': ", error);
        return done(err);
      });

      // new user successfully added to 'users'
      console.log(
        "New Twitter user added successfully to 'users': ",
        newUserOkPacket
      );

      // build newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type,
        username: null,
        hash: null,
        external_id: id
      };

      // return
      return done(null, newUser);
    }
  )
);
