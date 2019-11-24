const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

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

// GLOBAL QUERY STRINGS ----------------------------------------------------------------------------------
const findUserByEmailStr = `SELECT * FROM users
INNER JOIN local_account
ON users.id = local_account.local_user_id
WHERE local_account.local_email = ?`;

const newUserQueryStr = "INSERT INTO users(type) VALUES(?)";

// LOCAL SIGNUP ------------------------------------------------------------------------------------------
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      // override username with email
      usernameField: "email",
      passwordField: "password",
      proxy: true
    },
    async (email, password, done) => {
      if (email) email = email.toLowerCase();

      let findUserRows = null;

      // find user in db with that email
      try {
        findUserRows = await usePooledConnection(
          generalQuery,
          findUserByEmailStr,
          [email]
        );
      } catch (error) {
        console.error("Error checking if user already exists: ", error);
        return done(err);
      }

      // don't make new user if email already exists in db
      if (findUserRows.length) {
        console.log(
          `A user with that email ('${email}') already exists in the db: ${findUserRows}`
        );
        return done(null, false, { message: "Email already exists" });
      }

      // continue and make new user if email doesn't already exist in db
      console.log(
        `Email doesn't already exist in db: ${findUserRows}. Making new user.`
      );

      const newUserArgs = ["local"];
      let newUserOkPacket = null;

      // add new user to 'users'
      try {
        newUserOkPacket = await usePooledConnection(
          generalQuery,
          newUserQueryStr,
          newUserArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'users': ", error);
        return done(err);
      }

      // new user successfully added to 'users'
      console.log("New user added successfully to 'users': ", newUserOkPacket);

      // build (incomplete) newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type: "local",
        local_id: null,
        local_email: email
      };

      // get hash of password
      const pass = await createHash(password);

      const newLocalAccountQueryStr =
        "INSERT INTO local_account(local_email, local_hash, local_user_id) VALUES (?, ?, ?)";
      const newLocalAccountArgs = [email, pass, newUser.id];
      let newLocalAccountOkPacket = null;

      // add new user to 'local_account'
      try {
        newLocalAccountOkPacket = await usePooledConnection(
          generalQuery,
          newLocalAccountQueryStr,
          newLocalAccountArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'local_account': ", error);
        return done(err);
      }

      // new user successfully added to 'local_account'
      console.log(
        "New user added successfully to 'local_account': ",
        newLocalAccountOkPacket
      );

      // complete newUserObj
      newUser.local_id = newLocalAccountOkPacket.insertId;

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
      usernameField: "email",
      passwordField: "password",
      proxy: true
    },
    async (email, password, done) => {
      let findUserRows = null;

      // find user in the db
      try {
        findUserRows = await usePooledConnection(
          generalQuery,
          findUserByEmailStr,
          [email]
        );
      } catch (error) {
        console.error(`Error finding user ('${email}') in database: `, error);
        return done(err);
      }

      // no user found in db
      if (!findUserRows.length) {
        console.log(`Account ('${email}') doesn't exist`);
        return done(null, false, { message: "Account doesn't exist" });
      }

      // user found in db
      console.log(`User ('${email}') found`);

      // compare passwords
      const passwordFeedback = await checkPass(
        password,
        findUserRows[0].local_hash
      );
      console.log("passwordFeedback: ", passwordFeedback);

      switch (passwordFeedback) {
        case "incorrect":
        case "checkPassError":
          console.error(passwordFeedback);
          return done(null, false, { message: passwordFeedback });
        // correct pass
        default:
          console.log("pass correct. logging in");
          return done(null, findUserRows[0]);
      }
    }
  )
);

// GOOGLE --------------------------------------------------------------------------------------------------
//  {
//  id: '110894088504084209184',
//  displayName: 'Chintan Patel',
//  name: { familyName: 'Patel', givenName: 'Chintan' },
//  emails: [ { value: 'cpatel818@gmail.com', verified: true } ],
//  photos: [
//    {
//      value: 'https://lh3.googleusercontent.com/-QKYQh8HbfN0/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdAhpmtAXdCJEaRDuPDQ9H4JjTq9A/photo.jpg'
//    }
//  ],
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const findGoogleUserStr = `SELECT * FROM users
        INNER JOIN google_account
        ON users.id = google_account.google_user_id
        WHERE google_account.google_profile_id = ?`;

      let findUserRows = null;

      const {
        id,
        displayName,
        name: { familyName, givenName },
        emails
      } = profile;

      // find user in db with that googleID
      try {
        findUserRows = await usePooledConnection(
          generalQuery,
          findGoogleUserStr,
          [profile.id]
        );
      } catch (error) {
        console.error("Error checking if user already exists: ", error);
        return done(err);
      }

      // break out of callback and proceed forwards if googleID already exists in db
      if (findUserRows.length) {
        console.log(
          `A user with that googleID ('${profile.id}') found in db: ${findUserRows}`
        );
        return done(null, findUserRows[0]);
      }

      // continue and make new user if googleID doesn't already exist in db
      console.log(
        `GoogleID doesn't already exist in db: ${findUserRows}. Making new user.`
      );

      const newUserArgs = ["google"];
      let newUserOkPacket = null;

      // add new user to 'users'
      try {
        newUserOkPacket = await usePooledConnection(
          generalQuery,
          newUserQueryStr,
          newUserArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'users': ", error);
        return done(err);
      }

      // new user successfully added to 'users'
      console.log("New user added successfully to 'users': ", newUserOkPacket);

      // build (incomplete) newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type: "google",
        google_id: null,
        google_profile_id: id,
        google_display_name: displayName,
        google_given_name: givenName,
        google_family_name: familyName,
        google_email: emails[0].value
      };

      const newGoogleAccountQueryStr = `INSERT INTO google_account(
          google_profile_id,
          google_display_name,
          google_given_name,
          google_family_name,
          google_email,
          google_user_id
        ) VALUES (?, ?, ?, ?, ?, ?)`;
      const newGoogleAccountArgs = [
        id,
        displayName,
        givenName,
        familyName,
        emails[0].value,
        newUserOkPacket.insertId
      ];
      let newGoogleAccountOkPacket = null;

      // add new user to 'google_account'
      try {
        newGoogleAccountOkPacket = await usePooledConnection(
          generalQuery,
          newGoogleAccountQueryStr,
          newGoogleAccountArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'google_account': ", error);
        return done(err);
      }

      // new user successfully added to 'google_account'
      console.log(
        "New user added successfully to 'google_account': ",
        newGoogleAccountOkPacket
      );

      // complete newUserObj
      newUser.google_id = newGoogleAccountOkPacket.insertId;

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
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      return cb(null, false);
    }
  )
);
